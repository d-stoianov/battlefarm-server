import { Packet } from '@/Packet'
import { WebSocket } from 'ws'
import { Session } from '@/session/Session'

class SessionManager {
    private sessions: Session[] = []

    public createSession(ws: WebSocket) {
        const session = new Session(2)

        this.sessions.push(session)

        ws.send(
            JSON.stringify({
                messageType: 'session_created',
                body: { sessionId: session.getId() },
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
                        message: `Not found session by id sessionId`,
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
                        message: `Session if sull`,
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

    private findSession(id: string): Session | undefined {
        return this.sessions.find((s) => s.getId() === id)
    }
}

export { SessionManager }
