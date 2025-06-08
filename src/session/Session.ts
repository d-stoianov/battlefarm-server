import { Player } from '@/player/Player'
import { v4 as uuidv4 } from 'uuid'

enum SessionStatus {
    ACTIVE,
    WAITING_FOR_PLAYERS,
}

class Session {
    public readonly id: string
    private size: number = 0
    private players: Player[] = []
    private status: SessionStatus = SessionStatus.WAITING_FOR_PLAYERS

    constructor(size = 2) {
        this.id = uuidv4()
        this.size = size
    }

    get isFull() {
        return this.size === this.players.length
    }

    public getStatus() {
        return this.status
    }

    public getPlayers() {
        return this.players
    }

    public joinSession(ws: WebSocket) {
        if (this.isFull) {
            throw new Error('Session is full')
        }
        const player = new Player(ws)
        this.players.push(player)
    }

    public leaveSession(player: Player) {
        const indexToRemove = this.players.findIndex((p) => p.id === player.id)

        // mutate players array
        this.players = [
            ...this.players.slice(0, indexToRemove),
            ...this.players.slice(indexToRemove + 1),
        ]
    }

    public startSession() {
        this.status = SessionStatus.ACTIVE
    }
}

export { Session }
