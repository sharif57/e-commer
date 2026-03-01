"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useBuyerSupportMutation } from "@/redux/feature/buyerSupportSlice"
import { toast } from "sonner"

interface ContactFormData {
    subject: string
    message: string
    attachment: File | null
}

export default function ContactForm() {
    const [formData, setFormData] = useState<ContactFormData>({
        subject: "",
        message: "",
        attachment: null,
    })
    const [submitMessage, setSubmitMessage] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [buyerSupport, { isLoading }] = useBuyerSupportMutation();

    const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            subject: e.target.value,
        }))
    }

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            message: e.target.value,
        }))
    }

    const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setFormData((prev) => ({
            ...prev,
            attachment: file,
        }))
    }

    const handleAttachmentClick = () => {
        fileInputRef.current?.click()
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!formData.subject.trim() || !formData.message.trim()) {
            setSubmitMessage("Please fill in both subject and message fields.")
            return
        }

        setSubmitMessage("")

        try {
            const fd = new FormData()
            fd.append("subject", formData.subject)
            // API expects `des` based on provided sample
            fd.append("des", formData.message)
            if (formData.attachment) {
                fd.append("image", formData.attachment)
            }

        const res =    await buyerSupport(fd).unwrap()
            toast.success( res?.data?.message || "Email sent successfully")
            setSubmitMessage("Thank you! Your email has been sent successfully.")
            setFormData({ subject: "", message: "", attachment: null })
            if (fileInputRef.current) fileInputRef.current.value = ""
        } catch (err: unknown) {
            let apiMsg = "Failed to send email. Please try again."
            if (err && typeof err === "object" && "data" in err) {
                const e = err as { data?: { message?: string } }
                apiMsg = e.data?.message || apiMsg
            }
            setSubmitMessage(apiMsg)
            toast.error(apiMsg)
        }
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-lg sm:text-xl font-bold text-foreground mb-2">Email us</h1>
                <p className="text-muted-foreground">
                    How can we help you today? Share your questions or feedback to make our platform better for you.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Subject Field */}
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        value={formData.subject}
                        onChange={handleSubjectChange}
                        placeholder="Enter subject"
                        className="w-full px-4 py-3 border border-[#000000] rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                    />
                </div>

                {/* Message Field */}
                {/* <div>
                    <textarea
                        value={formData.message}
                        onChange={handleMessageChange}
                        placeholder="Write an email"
                        rows={10}
                        className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none"
                    />
                </div> */}
                <div className="relative">
                    <textarea
                        value={formData.message}
                        onChange={handleMessageChange}
                        placeholder="Write an email"
                        rows={10}
                        className="w-full px-4 py-3 pr-24 border border-[#000000] rounded-md bg-[#f1f1f1] text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none"
                    />

                    {/* Buttons (bottom-right inside textarea) */}
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">

                        {/* Attachment BTN */}
                        <button
                            type="button"
                            onClick={handleAttachmentClick}
                            className="px-2 py-1 text-sm border rounded-md hover:bg-muted transition"
                        >
                            <span>+</span> Attachment
                        </button>

                        {/* Send BTN */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-3 py-1 text-sm bg-none  text-black rounded-md disabled:opacity-50"
                        >
                            {isLoading ? "..." : "Send"}
                        </button>
                    </div>
                </div>



                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleAttachmentChange}
                    className="hidden"
                    aria-label="Attach file"
                />

                {/* Attachment Display */}
                {formData.attachment && (
                    <div className="text-sm text-muted-foreground px-4 py-2 bg-muted rounded-md">
                        📎 {formData.attachment.name}
                    </div>
                )}



                {/* Success/Error Message */}
                {submitMessage && (
                    <div
                        className={`text-sm px-4 py-2 rounded-md ${submitMessage.includes("successfully")
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                            }`}
                    >
                        {submitMessage}
                    </div>
                )}
            </form>
        </div>
    )
}
