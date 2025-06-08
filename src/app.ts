import { WebSocketServer } from 'ws'

const PORT = 8080

const wss = new WebSocketServer({ port: PORT })

console.log(`Websocket server is listening on port: ${PORT}`)

wss.on('connection', function connection(ws) {
    ws.on('error', console.error)

    ws.on('message', function message(data) {
        console.log('received: %s', data)
    })

    ws.send('something')
})
