const messageTypes = [
    'session_create',
    'session_created',
    'session_connect',
    'session_connected',
] as const

type MessageType = (typeof messageTypes)[number]

type Packet = {
    messageType?: MessageType
    body?: Record<string, string>
    error?: {
        message?: string,
        body?: Record<string, string>
    }
}

export { Packet }
