'use client'

import { useMemo, useState } from 'react'
import { Mail, RefreshCw, Smartphone, UserRound } from 'lucide-react'
import { useGetAllAdminsQuery } from '@/redux/feature/liveSupportSlice'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AdminRecord = {
    _id: string
    firstName?: string
    lastName?: string
    role?: string
    email?: string
    phone?: string
    subscription?: boolean
    verified?: boolean
}

export default function LiveChat() {
    const [page, setPage] = useState(1)
    const { data, isLoading, isFetching, isError, refetch } = useGetAllAdminsQuery(page)

    const admins: AdminRecord[] = data?.data?.result ?? []
    const meta = data?.data?.meta
    const totalPages = useMemo(() => {
        if (!meta?.limit || !meta?.total) return 1
        return Math.max(1, Math.ceil(meta.total / meta.limit))
    }, [meta?.limit, meta?.total])

    const handlePrev = () => setPage((prev) => Math.max(1, prev - 1))
    const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1))

    const handleWhatsApp = (phone?: string) => {
        if (!phone) return
        const digits = phone.replace(/\D/g, '')
        if (!digits) return
        window.open(`https://wa.me/${digits}`, '_blank')
    }

    const handleEmail = (email?: string) => {
        if (!email) return
        window.location.href = `mailto:${email}`
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <p className="text-sm text-muted-foreground">Live support contacts</p>
                    <h1 className="text-2xl font-semibold text-foreground">Admin directory</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={cn('w-4 h-4 mr-2', isFetching && 'animate-spin')} />
                        Reload
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Subscription</th>
                                <th className="px-4 py-3">Verified</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                                        Loading admins...
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-red-500">
                                        Failed to load admins. Please retry.
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !admins.length && !isError && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                                        No admins found.
                                    </td>
                                </tr>
                            )}

                            {admins.map((admin) => {
                                const fullName = [admin.firstName, admin.lastName].filter(Boolean).join(' ') || 'N/A'
                                return (
                                    <tr key={admin._id} className="border-t border-border/70">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <UserRound className="w-4 h-4" />
                                                </span>
                                                <div>
                                                    <p className="font-medium text-foreground">{fullName}</p>
                                                    <p className="text-xs text-muted-foreground">{admin.email || '—'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 capitalize text-foreground">{admin.role?.toLowerCase()}</td>
                                        <td className="px-4 py-3 text-foreground">{admin.email || '—'}</td>
                                        <td className="px-4 py-3 text-foreground">{admin.phone || '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn('rounded-full px-2 py-1 text-xs font-medium', admin.subscription ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
                                                {admin.subscription ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn('rounded-full px-2 py-1 text-xs font-medium', admin.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
                                                {admin.verified ? 'Verified' : 'Unverified'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEmail(admin.email)} disabled={!admin.email}>
                                                    <Mail className="w-4 h-4 mr-1" />
                                                    Email
                                                </Button>
                                                <Button variant="secondary" size="sm" onClick={() => handleWhatsApp(admin.phone)} disabled={!admin.phone}>
                                                    <Smartphone className="w-4 h-4 mr-1" />
                                                    WhatsApp
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-border bg-muted/30">
                    <div className="text-sm text-muted-foreground">
                        Page {meta?.page ?? page} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrev} disabled={page === 1 || isFetching}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleNext} disabled={page >= totalPages || isFetching}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
