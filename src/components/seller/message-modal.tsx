// "use client"

// import { useState } from "react"
// import { X, Send } from "lucide-react"

// interface MessageModalProps {
//   isOpen: boolean
//   onClose: () => void
//   sellerName: string
// }

// export default function MessageModal({ isOpen, onClose, sellerName }: MessageModalProps) {
//   const [messages, setMessages] = useState<
//     Array<{ id: string; text: string; sender: "user" | "seller"; timestamp: Date }>
//   >([
//     {
//       id: "1",
//       text: "Hi! I'm interested in your products. Do you have any discounts?",
//       sender: "user",
//       timestamp: new Date(Date.now() - 3600000),
//     },
//     {
//       id: "2",
//       text: "Hello! Thank you for your interest. We currently have a 10% discount for bulk orders.",
//       sender: "seller",
//       timestamp: new Date(Date.now() - 3300000),
//     },
//   ])
//   const [newMessage, setNewMessage] = useState("")

//   if (!isOpen) return null

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       setMessages([
//         ...messages,
//         {
//           id: String(messages.length + 1),
//           text: newMessage,
//           sender: "user",
//           timestamp: new Date(),
//         },
//       ])
//       setNewMessage("")
//       // Simulate seller response after a delay
//       setTimeout(() => {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: String(prev.length + 1),
//             text: "Thanks for your message! I'll get back to you soon.",
//             sender: "seller",
//             timestamp: new Date(),
//           },
//         ])
//       }, 1000)
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-muted bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white dark:bg-slate-950 rounded-lg shadow-lg max-w-2xl w-full max-h-96 flex flex-col">
//         {/* Modal Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
//           <div>
//             <h2 className="text-lg font-bold text-gray-900 dark:text-white">Message {sellerName}</h2>
//             <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-1 hover:bg-gray-100 rounded-lg dark:hover:bg-slate-800 transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//           </button>
//         </div>

//         {/* Messages Container */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900">
//           {messages.map((msg) => (
//             <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
//               <div
//                 className={`max-w-xs px-4 py-2 rounded-lg ${
//                   msg.sender === "user"
//                     ? "bg-blue-600 text-white rounded-br-none"
//                     : "bg-gray-200 text-gray-900 rounded-bl-none dark:bg-slate-800 dark:text-white"
//                 }`}
//               >
//                 <p className="text-sm">{msg.text}</p>
//                 <p
//                   className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}
//                 >
//                   {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Input Area */}
//         <div className="p-4 border-t border-gray-200 dark:border-slate-800 flex gap-2">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//             placeholder="Type a message..."
//             className="flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-gray-500"
//           />
//           <button
//             onClick={handleSendMessage}
//             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
//           >
//             <Send className="w-4 h-4" />
//             <span className="hidden sm:inline">Send</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import { X, Send } from "lucide-react"
import Image from "next/image"

interface MessageModalProps {
  isOpen: boolean
  onClose: () => void
  sellerName: string
}

export default function MessageModal({ isOpen, onClose, sellerName }: MessageModalProps) {
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; sender: "user" | "seller"; timestamp: Date }>
  >([
    {
      id: "1",
      text: "Hi! I'm interested in your products. Do you have any discounts?",
      sender: "user",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      text: "Hello! Thank you for your interest. We currently have a 10% discount for bulk orders.",
      sender: "seller",
      timestamp: new Date(Date.now() - 3300000),
    },
  ])

  const [newMessage, setNewMessage] = useState("")

  if (!isOpen) return null

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: String(messages.length + 1),
          text: newMessage,
          sender: "user",
          timestamp: new Date(),
        },
      ])
      setNewMessage("")

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: String(prev.length + 1),
            text: "Thanks for your message! I'll get back to you soon.",
            sender: "seller",
            timestamp: new Date(),
          },
        ])
      }, 1000)
    }
  }

  return (
    <div
      className="
        fixed inset-0 
        bg-white/10 dark:bg-black/20 
        backdrop-blur-lg backdrop-saturate-150
        z-50 flex items-center justify-center p-4
      "
    >
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-lg shadow-lg max-w-2xl w-full max-h-96 flex flex-col border border-white/20 dark:border-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/40 dark:border-slate-800/40">
          <div className="flex items-center gap-2">
            <Image src="/images/seller profile photo.png" alt="Logo" width={40} height={40} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{sellerName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100/60 rounded-lg dark:hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/60 dark:bg-slate-900/60 backdrop-blur-sm">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-[#29845A] text-white rounded-br-none"
                    : "bg-gray-200/80 text-gray-900 rounded-bl-none dark:bg-slate-800/80 dark:text-white"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200/40 dark:border-slate-800/40 flex gap-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100/80 border border-gray-200/40 rounded-lg text-sm 
                       focus:outline-none focus:border-blue-600 
                       dark:bg-slate-800/80 dark:border-slate-700 dark:text-white dark:placeholder-gray-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-[#29845A] hover:bg-[#29845A]/80 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
