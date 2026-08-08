import http from "http";
import { v4 as uuidv4 } from "uuid";
import {
    IncomingMessageSchema,
    type IncommingMessage,
    type SignUpIncommingMessage,
    type ValidateIncommingMessage,
} from "@repo/common";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";
import { WebSocket, WebSocketServer } from "ws";
import { db } from "./config/db";

type AvailableValidator = {
    validatorId: string;
    socket: WebSocket;
    publicKey: string;
};

type PendingCallback = {
    handler: (data: ValidateIncommingMessage) => Promise<void>;
    timeout: ReturnType<typeof setTimeout>;
};

const availableValidators: AvailableValidator[] = [];
const CALLBACKS = new Map<string, PendingCallback>();
const COST_PER_VALIDATION = 100;
const VALIDATION_TIMEOUT_MS = 30_000;

const server = http.createServer();
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
    try {
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit("connection", ws, req);
        });
    } catch {
        socket.destroy();
    }
});

// Previous bug: `message` and `close` were registered on `wss`. They are emitted
// by each connected WebSocket, so both listeners must be attached here.
wss.on("connection", (ws, req) => {
    const ip = req.socket.remoteAddress ?? "unknown";

    ws.on("message", async (rawMessage) => {
        try {
            const data = parseIncomingMessage(rawMessage.toString());
            if (!data) {
                ws.close(1008, "Invalid message");
                return;
            }

            if (data.type === "signup") {
                const verified = verifyMessage(
                    `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
                    data.data.publicKey,
                    data.data.signedMessage,
                );

                if (!verified) {
                    ws.close(1008, "Invalid signup signature");
                    return;
                }

                // Do not trust a client-supplied IP; use the peer address instead.
                await signUpHandler(ws, { ...data.data, ip });
                return;
            }

            const pending = CALLBACKS.get(data.data.callbackId);
            if (!pending) {
                // A late or unsolicited response must not crash the hub.
                console.warn(`Ignoring unknown callback ${data.data.callbackId}`);
                return;
            }

            // Delete before awaiting so a validator cannot submit the same job twice.
            CALLBACKS.delete(data.data.callbackId);
            clearTimeout(pending.timeout);
            await pending.handler(data.data);
        } catch (error) {
            console.error("Failed to process validator message", error);
        }
    });

    ws.on("close", () => {
        // `findIndex` can be -1; filter avoids accidentally removing the last validator.
        const index = availableValidators.findIndex((validator) => validator.socket === ws);
        if (index !== -1) availableValidators.splice(index, 1);
    });
});

function parseIncomingMessage(message: string): IncommingMessage | null {
    let value: unknown;
    try {
        value = JSON.parse(message);
    } catch {
        return null;
    }

    const result = IncomingMessageSchema.safeParse(value);
    return result.success ? result.data : null;
}

function verifyMessage(message: string, publicKey: string, signature: string) {
    const messageBytes = nacl_util.decodeUTF8(message);
    return nacl.sign.detached.verify(
        messageBytes,
        new Uint8Array(JSON.parse(signature)),
        new PublicKey(publicKey).toBytes(),
    );
}

async function signUpHandler(
    ws: WebSocket,
    { ip, publicKey, callbackId }: SignUpIncommingMessage,
) {
    let validator = await db.validator.findFirst({ where: { publicKey } });

    if (!validator) {
        validator = await db.validator.create({
            data: { ip, publicKey, location: "unknown", pendingPayout: 0 },
        });
    }

    // Previous bug: new database rows were pushed without their socket, making
    // them unusable for dispatch. Replace any duplicate registration for this socket.
    const existingIndex = availableValidators.findIndex((item) => item.socket === ws);
    if (existingIndex !== -1) availableValidators.splice(existingIndex, 1);
    availableValidators.push({
        validatorId: validator.id,
        socket: ws,
        publicKey: validator.publicKey,
    });

    ws.send(
        JSON.stringify({
            type: "signup",
            data: { callbackId, validatorId: validator.id },
        }),
    );
}

async function dispatchValidations() {
    try {
        const websitesToMonitor = await db.website.findMany({
            where: { disabled: false },
        });

        for (const website of websitesToMonitor) {
            for (const validator of availableValidators) {
                if (validator.socket.readyState !== WebSocket.OPEN) continue;

                const callbackId = uuidv4();
                const timeout = setTimeout(() => {
                    CALLBACKS.delete(callbackId);
                }, VALIDATION_TIMEOUT_MS);

                CALLBACKS.set(callbackId, {
                    timeout,
                    handler: async (data) => {
                        const verified = verifyMessage(
                            `Replaying to CallbackId ${data.callbackId}`,
                            validator.publicKey,
                            data.signedMessage,
                        );
                        if (!verified) return;

                        await db.$transaction(async (tx) => {
                            await tx.websiteTicks.create({
                                data: {
                                    websiteId: website.id,
                                    // Previous bug: this used the message's validatorId. Use the
                                    // validator associated with the socket that received the job.
                                    validatorId: validator.validatorId,
                                    status: data.status === "up" ? "Good" : "Bad",
                                    latency: data.latency,
                                },
                            });
                            await tx.validator.update({
                                where: { id: validator.validatorId },
                                data: {
                                    pendingPayout: { increment: COST_PER_VALIDATION },
                                },
                            });
                        });
                    },
                });

                try {
                    validator.socket.send(
                        JSON.stringify({
                            type: "validate",
                            data: { url: website.url, websiteId: website.id, callbackId },
                        }),
                    );
                } catch (error) {
                    clearTimeout(timeout);
                    CALLBACKS.delete(callbackId);
                    console.error(`Failed to dispatch validation to ${validator.validatorId}`, error);
                }
            }
        }
    } catch (error) {
        console.error("Failed to dispatch validations", error);
    }
}

setInterval(() => {
    void dispatchValidations();
}, 60_000);

const hubPort = Number(process.env.PORT) || 3001;
server.listen(hubPort, () => {
    console.log(`Hub running on port ${hubPort}`);
});
