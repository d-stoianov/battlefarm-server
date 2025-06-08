const messageTypes = [
    'session_create',
    'session_created',
    'session_connect',
    'session_connected',
    'session_leave',
    'session_left',
] as const

type MessageType = (typeof messageTypes)[number]

type Packet = {
    messageType?: MessageType
    body?: Record<string, string>
    error?: {
        message?: string
        body?: Record<string, string>
    }
}

export { Packet }
