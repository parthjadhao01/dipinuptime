import http from "http"
import { v4 as uuidv4 } from 'uuid';
import { type IncommingMessage, type SignUpIncommingMessage } from "@repo/common"
import { PublicKey } from "@solana/web3.js"
import nacl from "tweetnacl"
import nacl_util from "tweetnacl-util"
import { WebSocket, WebSocketServer } from "ws"
import {db} from "./config/db"

const availableValidators: { validatorId: string, socket: WebSocket, publicKey: string }[] = [];
const CALLBACKS: { [callbackId: string]: (data: IncommingMessage) => void } = {};
const COST_PER_VALDATION = 100;

const server = http.createServer();
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", async (req, socket, head) => {
    try {
        wss.handleUpgrade(req, socket, head, (ws) => {

            wss.emit("connection", ws, req);
        })
    } catch (err) {
        socket.destroy();
    }
})
wss.on("close", (ws: WebSocket, req: Request) => {
    availableValidators.splice(availableValidators.findIndex(v => v.socket == ws), 1);
})
wss.on("message",async (ws: WebSocket, message: string) => {
    const data = JSON.parse(message) as IncommingMessage;
    if (data.type == "signup") {
        const verfied = await verifyMessage(
            `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
            data.data.publicKey,
            data.data.signedMessage
        )
        if(verfied){

        }
    }
    if (data.type == "validate"){
        CALLBACKS[data.data.callbackId](data);
        delete CALLBACKS[data.data.callbackId];
    }
})

const verifyMessage = async (message: string, publicKey: string, signature: string) => {
    const messageBytes = nacl_util.decodeUTF8(message);
    const result = nacl.sign.detached.verify(
        messageBytes,
        new Uint8Array(JSON.parse(signature)),
        new PublicKey(publicKey).toBytes()
    )

    return result
}
const signUpHandler = async (ws: WebSocket, {ip,publicKey,signedMessage,callbackId} : SignUpIncommingMessage) => {
    const validatorDb = await db.validator.findFirst({
        where : {
            publicKey : publicKey
        }
    })

    if(validatorDb){
        ws.send(JSON.stringify({
            type : "signup",
            data : {
                callbackId,
                validatorId : validatorDb.id
            }
        }))

        availableValidators.push({
            validatorId : validatorDb.id,
            socket : ws,
            publicKey : validatorDb.publicKey
        });
        return 
    }

    // TODO : write a logic to get location of the validator from the ip address and store it in the database
    const validator = await db.validator.create({
        data : {
            ip,
            publicKey,
            location : "unknown",
            pendingPayout : 0,
        }
    })

    ws.send(JSON.stringify({
        type : "signup",
        data : {
            callbackId,
            validatorId : validator.id
        }
    }))
}

// TODO : write a logic to distribute the validate request to the avaliable validator such that there are various group of validator having to validate one website from different locations and there should be minimum more than 2 validator for each location
setInterval(async () => {
    const WebsiteToMonitor = await db.website.findMany({
        where : {
            disabled : false
        }
    })

    for(const website of WebsiteToMonitor){
         availableValidators.forEach(validator=>{
            const callbackId = uuidv4();
            console.log(`sending validate request to ${validator.validatorId} for website ${website.url}`)
            validator.socket.send(JSON.stringify({
                type : "validate",
                data : {
                    url : website.url,
                    callbackId
                }
            }))

            CALLBACKS[callbackId] = async (data : IncommingMessage) => {
                if(data.type == "validate"){
                    const {validatorId,signedMessage,status,latency} = data.data;
                    const verified = await verifyMessage(
                        `Replaying to CallbackId ${data.data.callbackId}`,
                        validator.publicKey,
                        signedMessage
                    );

                    if(!verified){
                        return
                    }
                    
                    await db.$transaction(async (tx)=>{
                        await tx.websiteTicks.create({
                            data : {
                                websiteId : website.id,
                                validatorId : validatorId,
                                status : status,
                                latency : latency,
                                createdAt : new Date()
                            }
                        })

                        await tx.validator.update({
                            where : {id : validatorId},
                            data : {
                                pendingPayout : {
                                    increment : COST_PER_VALDATION
                                }
                            }
                        })
                    })

                }
            }
        })
    }
},1000 * 60)