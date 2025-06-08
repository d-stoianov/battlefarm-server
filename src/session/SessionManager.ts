import { Packet } from '@/Packet'
import { WebSocket } from 'ws'
import { Session } from '@/session/Session'
import { Player } from '@/player/Player'

class SessionManager {
    private sessions: Session[] = []

    public createSession(ws: WebSocket) {
        const player = new Player(ws)
        const session = new Session(2, player)

        console.log(`Player ${player.id} created session ${session.id}`)

        this.sessions.push(session)

        ws.send(
            JSON.stringify({
                messageType: 'SESSION_CREATED',
                body: { sessionId: session.id, playerId: player.id },
            } as Packet)
        )
    }

    public connectToSession(ws: WebSocket, sessionId: string) {
        const session = this.findSession(sessionId)

        // check if this session exists
        if (!session) {
            ws.send(
                JSON.stringify({
                    error: {
                        message: `Session by id ${sessionId} was not found`,
                    },
                } as Packet)
            )
            return
        }

        // check if session is full
        if (session.isFull) {
            ws.send(
                JSON.stringify({
                    error: {
                        message: `Session is full`,
                    },
                } as Packet)
            )
            return
        }

        const player = new Player(ws)
        session.joinSession(player)

        console.log(`Player ${player.id} joined session ${session.id}`)

        // connect user to the session
        ws.send(
            JSON.stringify({
                messageType: 'SESSION_CONNECTED',
                body: { playerId: player.id },
            } as Packet)
        )
    }

    public leaveSession(ws: WebSocket, playerId: string) {
        const session = this.findSessionByPlayerId(playerId)

        // check if this session exists
        if (!session) {
            ws.send(
                JSON.stringify({
                    error: {
                        message: `Player is not connected to any session`,
                    },
                } as Packet)
            )
            return
        }

        session.leaveSession(playerId)
        console.log(`Player ${playerId} left session ${session.id}`)

        console.log(`Session ${session.id} players: ${session.getPlayers()}`)

        // connect user to the session
        ws.send(
            JSON.stringify({
                messageType: 'SESSION_LEFT',
            } as Packet)
        )
    }

    // find session by session id
    private findSession(id: string): Session | undefined {
        return this.sessions.find((s) => s.id === id)
    }

    private findSessionByPlayerId(playerId: string): Session | undefined {
        return this.sessions.find((s) => {
            return s.getPlayers().some((p) => p.id === playerId)
        })
    }
}

export { SessionManager }
