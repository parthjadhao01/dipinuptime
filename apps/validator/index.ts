// @ts-ignore
import * as WebSocket from 'ws';


const wss = new WebSocket.Server({ port : 8080})

let callback = {}

wss.on('connection',(ws : WebSocket)=>{

    // event there are two types of events 1 registration signup and 2nd validation response storing
    ws.on('',(message : any)=>{

    })
})

