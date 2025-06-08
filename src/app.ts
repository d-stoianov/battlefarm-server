import { WebSocketServer } from 'ws'
import { PORT } from '@/config'
import { Packet } from '@/Packet'
import { SessionManager } from '@/session/SessionManager'

const wss = new WebSocketServer({ port: PORT })

console.log(`Websocket server is listening on port: ${PORT}`)

const sessionManager = new SessionManager()

wss.on('connection', function connection(ws) {
    ws.on('message', (rawData) => {
        const packet = JSON.parse(rawData.toString()) as Packet

        console.log('PACKET: ', packet)

        if (!('messageType' in packet)) {
            return
        }

        switch (packet.messageType) {
            case 'SESSION_CONNECT':
                if (packet?.body && packet.body?.sessionName) {
                    sessionManager.connectToSession(ws, packet.body.sessionName)
                    return
                }
            case 'SESSION_LEAVE':
                if (packet?.body && packet.body?.sessionName) {
                    sessionManager.leaveSession(ws, packet.body.sessionName)
                    return
                }
            default:
                ws.send(
                    JSON.stringify({
                        error: {
                            message:
                                'Unrecognizable combination of message type and body',
                        },
                    } as Packet)
                )
                return
        }
    })
})
