import { v4 as uuidv4 } from 'uuid'

enum SessionStatus {
    ACTIVE,
    WAITING_FOR_PLAYERS,
}

class Session {
    private readonly id: string
    private size: number = 0
    private connections: WebSocket[] = []
    private status: SessionStatus = SessionStatus.WAITING_FOR_PLAYERS

    constructor(size = 2) {
        this.id = uuidv4()
        this.size = size
    }

    get isFull() {
        return this.size === this.connections.length
    }

    public getId() {
        return this.id
    }

    public getStatus() {
        return this.status
    }

    public joinSession(connection: WebSocket) {
        if (this.isFull) {
            throw new Error("Session is full")
        }
        this.connections.push(connection)
    }

    public startSession() {
        this.status = SessionStatus.ACTIVE
    }
}

export { Session }
