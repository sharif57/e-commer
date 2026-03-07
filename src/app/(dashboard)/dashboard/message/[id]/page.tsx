/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { X, Plus, Send, Loader2 } from 'lucide-react'
import { useGetUsersQuery } from '@/redux/feature/userSlice'
import { getSocket } from '@/lib/socket'
import { toast } from 'sonner'
import { useCreateInboxMutation } from '@/redux/feature/socket/messageSlice'

interface ChatMessage {
    id: string
    text: string
    senderId: string
    timestamp: Date
}

export default function MessageDetailsPage() {
    const params = useParams<{ id: string }>()
    const searchParams = useSearchParams()
    const router = useRouter()
    const inboxId = params?.id ?? ''
    // http://localhost:3000/dashboard/message/6991929b08040e40065d390c?senderId=6932a3d77d740510efe6d778&
    const senderId = searchParams?.get('senderId') || ''
    console.log(senderId, 'sendewr')
    const receiverId = searchParams?.get('receiverId') || ''
    const displayName = searchParams?.get('name') || 'Conversation'
    const displayImage = searchParams?.get('image') || ''

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [activeInboxId, setActiveInboxId] = useState(inboxId)

    const [createInbox] = useCreateInboxMutation()
    const [replyText, setReplyText] = useState('')
    const [attachedFiles, setAttachedFiles] = useState<string[]>([])
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    // {
    //           "senderId":"6932a3d77d740510efe6d778",
    //           "message":"hello",
    //           "inboxId":"696ba98e8986dc7e35e6972b"
    // }
    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        setActiveInboxId(inboxId)
    }, [inboxId])

    useEffect(() => {
        if (!receiverId  || !inboxId) {
            return
        }

        let cancelled = false

        createInbox(receiverId)
            .unwrap()
            .then((res: any) => {
                if (cancelled) return

                const canonicalInboxId = res?.data?._id
                if (!canonicalInboxId) return

                setActiveInboxId(canonicalInboxId)

                if (canonicalInboxId !== inboxId) {
                    const params = new URLSearchParams(searchParams?.toString() ?? '')
                    params.set('receiverId', receiverId)
                    params.set('senderId', senderId)
                    router.replace(`/dashboard/message/${canonicalInboxId}?${params.toString()}`)
                }
            })
            .catch(() => {
                // Keep current inboxId if canonical resolution fails.
            })

        return () => {
            cancelled = true
        }
    }, [receiverId, senderId, inboxId, createInbox, router, searchParams])

    // Socket initialization and message loading
    useEffect(() => {
        if (!activeInboxId || !senderId) {
            console.log('❌ Missing inboxId or senderId:', { inboxId: activeInboxId, senderId })
            return
        }

        console.log('🔌 Initializing socket for inbox:', activeInboxId)
        const socket = getSocket()

        if (!socket) {
            console.error(' Socket not available')
            return
        }

        // Connect socket
        if (!socket.connected) {
            console.log('🔌 Connecting socket...')
            socket.connect()
        }

        // Connection handlers
        const handleConnect = () => {
            console.log(' Socket connected:', socket.id)
            setIsConnected(true)
            joinInbox()

            // Load initial messages via HTTP
            loadMessages()
        }

        const handleDisconnect = () => {
            console.log('❌ Socket disconnected')
            setIsConnected(false)
        }

        const handleConnectError = (error: any) => {
            console.error('❌ Socket connection error:', error)
            setIsConnected(false)
            toast.error('Connection error. Please refresh.')
        }

        const joinInbox = () => {
            socket.emit('join-inbox', activeInboxId)
        }

        // Message receive handler
        const receiveEvent = `receive-message:${activeInboxId}`
        const handleReceiveMessage = (data: any) => {
            console.log(`📩 [${receiveEvent}] Message received:=============`, data, receiveEvent)

            if (!data) {
                console.warn('⚠️ Empty message data received')
                return
            }

            if (data.inboxId && data.inboxId !== activeInboxId) {
                return
            }

            const newMessage: ChatMessage = {
                id: data._id || `msg-${Date.now()}-${Math.random()}`,
                text: data.message || '',
                senderId: data.senderId || '',
                timestamp: data.createdAt ? new Date(data.createdAt) : new Date(),
            }

            console.log('➕ Adding message to state:', newMessage)

            setMessages((prev) => {
                if (prev.some((msg) => msg.id === newMessage.id)) {
                    console.log('⚠️ Duplicate message, ignoring:', newMessage.id)
                    return prev
                }

                if (newMessage.senderId === senderId) {
                    const optimisticIndex = prev.findIndex(
                        (msg) =>
                            msg.id.startsWith('temp-') &&
                            msg.senderId === newMessage.senderId &&
                            msg.text === newMessage.text
                    )

                    if (optimisticIndex >= 0) {
                        const next = [...prev]
                        next[optimisticIndex] = newMessage
                        console.log('♻️ Replaced optimistic message with server message')
                        return next
                    }
                }

                const updated = [...prev, newMessage]
                console.log('📝 Updated messages count:', updated.length)
                return updated
            })
        }

        // Load messages from API
        const loadMessages = async () => {
            console.log('📥 Loading messages for inbox:', activeInboxId)
            setIsLoadingMessages(true)

            try {
                const response = await fetch(
                    `http://69.62.70.69:5003/api/v1/message/get-message/${activeInboxId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        },
                    }
                )

                const result = await response.json()
                console.log(' API Response:', result)

                if (result.success && result.data?.result) {
                    const messageList = result.data.result
                    console.log('📨 Messages loaded:', messageList.length)

                    const loadedMessages: ChatMessage[] = messageList.map((msg: any) => ({
                        id: msg._id || `msg-${Date.now()}-${Math.random()}`,
                        text: msg.message || '',
                        senderId: msg.senderId || '',
                        timestamp: msg.createdAt ? new Date(msg.createdAt) : new Date(),
                    }))

                    // Sort by timestamp (oldest first)
                    loadedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

                    setMessages(loadedMessages)
                    console.log(' Messages set to state:', loadedMessages.length)
                } else {
                    console.log('ℹ No messages in response')
                    setMessages([])
                }
            } catch (error) {
                console.error('❌ Error loading messages:', error)
                toast.error('Failed to load messages')
            } finally {
                setIsLoadingMessages(false)
            }
        }

        // Register event listeners
        socket.on('connect', handleConnect)
        socket.on('disconnect', handleDisconnect)
        socket.on('connect_error', handleConnectError)
        socket.on(receiveEvent, handleReceiveMessage)

        console.log(`👂 Listening to event: ${receiveEvent}`)

        // If already connected, load messages immediately
        if (socket.connected) {
            handleConnect()
            joinInbox()
        }

        // Cleanup
        return () => {
            console.log(`🧹 Cleaning up socket listeners for: ${receiveEvent}`)
            socket.off('connect', handleConnect)
            socket.off('disconnect', handleDisconnect)
            socket.off('connect_error', handleConnectError)
            socket.off(receiveEvent, handleReceiveMessage)
        }
    }, [activeInboxId])

    const handleSendMessage = () => {
        if (!replyText.trim()) {
            console.warn('Empty message, not sending')
            return
        }

        

        if (!activeInboxId) {
            console.error(' No inbox ID')
            toast.error('Invalid conversation')
            return
        }

        const socket = getSocket()
        if (!socket) {
            console.error(' Socket not available')
            toast.error('Connection not available')
            return
        }

        if (!socket.connected) {
            console.error('Socket not connected')
            toast.error('Not connected. Please refresh.')
            return
        }

        const payload = {
            senderId: senderId,
            message: replyText.trim(),
            inboxId: inboxId,
        }

        console.log('Sending message via socket:', payload)

        setIsSending(true)

        try {
            socket.emit('send-message', payload)
            console.log('Message emitted successfully', payload)

            // Optimistic update
            const optimisticMessage: ChatMessage = {
                id: `temp-${Date.now()}`,
                text: replyText.trim(),
                senderId: senderId,
                timestamp: new Date(),
            }

            console.log('Adding optimistic message:', optimisticMessage)
            setMessages((prev) => [...prev, optimisticMessage])

            // Clear input
            setReplyText('')
            setAttachedFiles([])

            toast.success('Message sent')
        } catch (error) {
            console.error(' Error sending message:', error)
            toast.error('Failed to send message')
        } finally {
            setIsSending(false)
        }
    }

    const handleAttachFile = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if (files) {
            const fileNames = Array.from(files).map(f => f.name)
            setAttachedFiles([...attachedFiles, ...fileNames])
        }
    }

    const removeAttachment = (index: number) => {
        setAttachedFiles(attachedFiles.filter((_, i) => i !== index))
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div>
            <div className="min-h-screen border border-border rounded-xl flex flex-col">
                {/* Header */}
                <div className="border-b p-4 sm:p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={displayImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
                                alt={displayName}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                            />
                            <div>
                                <h1 className="text-lg sm:text-xl font-semibold text-foreground">
                                    {displayName}
                                </h1>
                                <p className="text-xs text-gray-500">
                                    {isConnected ? '🟢 Connected' : '🔴 Connecting...'}
                                </p>
                            </div>
                        </div>
                        <button className="text-foreground/60 hover:text-foreground transition-colors p-2 hover:bg-muted rounded-md">
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                        {isLoadingMessages ? (
                            <div className="flex items-center justify-center h-full py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                <span className="ml-2 text-gray-500">Loading messages...</span>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full py-12">
                                <p className="text-gray-400">No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((message) => {
                                const isCurrentUser = message.senderId === senderId
                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 sm:px-5 py-3 rounded-2xl ${isCurrentUser
                                                ? 'bg-blue-500 text-white rounded-tr-none'
                                                : 'bg-white text-foreground border border-gray-200 rounded-tl-none'
                                                }`}
                                        >
                                            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                                                {message.text}
                                            </p>
                                            <p
                                                className={`text-xs mt-2 ${isCurrentUser ? 'text-white/70' : 'text-foreground/50'
                                                    }`}
                                            >
                                                {message.timestamp.toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="border-t p-4 sm:p-6 bg-white">
                    <div className="max-w-4xl mx-auto">
                        {/* Attachments Display */}
                        {attachedFiles.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {attachedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-muted p-3 rounded-lg"
                                    >
                                        <span className="text-sm text-foreground truncate">{file}</span>
                                        <button
                                            onClick={() => removeAttachment(index)}
                                            className="text-foreground/50 hover:text-foreground transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Input Controls */}
                        <div className="flex gap-3 sm:gap-4 items-center">
                            {/* <button
                                onClick={handleAttachFile}
                                className="flex-shrink-0 flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors font-medium text-sm"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">Attach</span>
                            </button> */}

                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    name="text"
                                    id="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Write your message..."
                                    disabled={!isConnected || isSending}
                                    className="peer border border-gray-300 dark:bg-slate-900 dark:placeholder:text-slate-500 
                                        dark:text-[#abc2d3] dark:border-slate-600 rounded-lg outline-none 
                                        pl-4 pr-12 py-3 w-full focus:border-blue-500 transition-colors duration-300
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                />

                                <button
                                    onClick={handleSendMessage}
                                    disabled={!replyText.trim() || !isConnected || isSending}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 
                                        text-blue-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {isSending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <span className="hidden sm:inline text-sm">Send</span>
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {!isConnected && (
                            <p className="text-xs text-orange-500 mt-2">Connecting to server...</p>
                        )}

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            multiple
                            className="hidden"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
