import http from "http";
import { Keypair } from "@solana/web3.js";
import nacl_util from "tweetnacl-util";
import nacl from "tweetnacl"
import { WebSocketServer } from "ws";
import { type OutgoingMessage} from "@repo/common"

async function main(){
    const keypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY as string))
    );
    const server = http.createServer();
    const wss = new WebSocketServer({noServer : true})
    server.on("upgrade", (req,socket,head)=>{
        try{
            wss.handleUpgrade(req,socket,head,(ws)=>{
                wss.emit("connection",ws,req);
            })
        }catch{
            socket.destroy();
        }
    })
    wss.on("connection",(ws,req)=>{
        ws.on("message", (event)=>{
            const data : OutgoingMessage = JSON.parse(event.toString());
        })
    })
}

async function signMessage(message : string,keypair : Keypair){
    const messageBytes = nacl_util.decodeUTF8(message);
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);

    return JSON.stringify(Array.from(signature));
}
