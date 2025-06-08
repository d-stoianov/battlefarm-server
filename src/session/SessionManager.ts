import { Packet } from '@/Packet'
import { WebSocket } from 'ws'
import { Session } from '@/session/Session'
import { Player } from '@/player/Player'

class SessionManager {
    private sessions: Session[] = []

    public connectToSession(ws: WebSocket, sessionName: string) {
        const session = this.findSessionByName(sessionName)

        // if session doesn't exist - create one
        if (!session) {
            this.createSession(ws, sessionName)
            return
        }

        // if session exists - check if it's full
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

        console.log(`Player ${player.id} joined session ${session.name}`)

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
        console.log(`Player ${playerId} left session ${session.name}`)

        console.log(`Session ${session.name} players: ${session.getPlayers()}`)

        // connect user to the session
        ws.send(
            JSON.stringify({
                messageType: 'SESSION_LEFT',
            } as Packet)
        )
    }

    private createSession(ws: WebSocket, sessionName: string) {
        const player = new Player(ws)
        const session = new Session(2, player, sessionName)

        console.log(`Player ${player.id} created session ${session.name}`)

        this.sessions.push(session)

        ws.send(
            JSON.stringify({
                messageType: 'SESSION_CREATED',
                body: { playerId: player.id },
            } as Packet)
        )
    }

    // find session by session name
    private findSessionByName(name: string): Session | undefined {
        return this.sessions.find((s) => s.name === name)
    }

    private findSessionByPlayerId(playerId: string): Session | undefined {
        return this.sessions.find((s) => {
            return s.getPlayers().some((p) => p.id === playerId)
        })
    }
}

export { SessionManager }
