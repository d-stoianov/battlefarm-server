import { Packet } from '@/Packet'
import { WebSocket } from 'ws'
import { Session } from '@/session/Session'
import { Player } from '@/player/Player'

class SessionManager {
    private sessions: Session[] = []

    public createSession(ws: WebSocket) {
        const session = new Session(2)

        this.sessions.push(session)

        ws.send(
            JSON.stringify({
                messageType: 'session_created',
                body: { sessionId: session.id },
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
                        message: `Not found session by id ${sessionId}`,
                    },
                } as Packet)
            )
            return
        }

        // check if session is not full
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

        // connect user to the session
        ws.send(
            JSON.stringify({
                messageType: 'session_connected',
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

        // connect user to the session
        ws.send(
            JSON.stringify({
                messageType: 'session_left',
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
