enum MessageType {
    SESSION_CONNECT = 'SESSION_CONNECT',
    SESSION_CREATED = 'SESSION_CREATED',
    SESSION_CONNECTED = 'SESSION_CONNECTED',
    SESSION_LEAVE = 'SESSION_LEAVE',
    SESSION_LEFT = 'SESSION_LEFT',
}

type Packet = {
    messageType?: MessageType
    body?: Record<string, string>
    error?: {
        message?: string
        code?: number
    }
}

export { Packet }
