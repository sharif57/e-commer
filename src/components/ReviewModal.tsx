import React from 'react';
import { Star, X } from 'lucide-react';
import Image from 'next/image';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    reviews: any[];
    totalReviews: number;
    averageRating: number;
    reviewCountData?: any;
}

export default function ReviewModal({ isOpen, onClose, reviews, totalReviews, averageRating, reviewCountData }: ReviewModalProps) {
    if (!isOpen) return null;

    // Calculate rating distribution from reviews if reviewCountData is not structured well
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews && reviews.length > 0) {
        reviews.forEach(r => {
            const rating = Math.round(r.rating) || 0;
            if (rating >= 1 && rating <= 5) {
                distribution[rating as keyof typeof distribution]++;
            }
        });
    }

    const getCount = (star: number) => {
        // If reviewCountData provides the counts
        if (Array.isArray(reviewCountData)) {
            const found = reviewCountData.find(item => item.rating === star || item._id === star);
            if (found) return found.count;
        } else if (reviewCountData && typeof reviewCountData === 'object' && reviewCountData[star] !== undefined) {
            return reviewCountData[star];
        }
        return distribution[star as keyof typeof distribution] || 0;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays < 30) return `${diffDays} days ago`;
        const diffMonths = Math.floor(diffDays / 30);
        if (diffMonths < 12) return `${diffMonths} mo ago`;
        return `${Math.floor(diffMonths / 12)} yr ago`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] md:h-[600px] overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full p-2 z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col md:flex-row h-full overflow-hidden">
                    {/* Left Column: Ratings Summary */}
                    <div className="w-full md:w-[40%] p-8 lg:p-10 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto bg-white flex flex-col justify-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ratings and review</h2>

                        <div className="mb-2">
                            <span className="text-7xl font-extrabold text-gray-900">{averageRating.toFixed(1)}</span>
                        </div>

                        <div className="flex items-center gap-1.5 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 ${averageRating >= star ? 'fill-[#FFD700] text-[#FFD700]' : 'fill-gray-200 text-gray-200'}`}
                                />
                            ))}
                        </div>

                        <p className="text-gray-600 mb-10 text-sm font-medium">{totalReviews} product ratings</p>

                        <div className="space-y-3.5 w-full max-w-[280px]">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = getCount(star);
                                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 w-8">
                                            <span className="text-sm font-bold text-gray-800">{star}</span>
                                            <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                                        </div>
                                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#FFD700] rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <div className="w-8 text-right text-sm text-gray-400 font-medium">
                                            {count}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Reviews List */}
                    <div className="w-full md:w-[60%] p-6 lg:p-10 overflow-y-auto bg-white">
                        <h3 className="text-xl font-bold text-gray-900 mb-8">Most relevant reviews</h3>

                        <div className="space-y-10">
                            {reviews.length > 0 ? reviews.map((review: any) => (
                                <div key={review._id} className="pb-8 border-b border-gray-100 last:border-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 relative border border-gray-100">
                                                {review?.userId?.image ? (
                                                    <Image
                                                        src={review.userId.image}
                                                        alt={review.userId.email || 'User'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                                        {(review?.userId?.email || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-gray-900">
                                                    {review?.userId?.firstName
                                                        ? `${review.userId.firstName} ${review.userId.lastName || ''}`
                                                        : (review?.userId?.email?.split('@')[0] || 'Anonymous User')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-xs text-gray-500 font-medium">
                                                {formatDate(review.createdAt)}
                                            </div>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${review.rating >= star ? 'fill-[#FFD700] text-[#FFD700]' : 'fill-gray-200 text-gray-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap mb-4">
                                        {review.review}
                                    </p>

                                    {review.image && (
                                        <div className="mt-4 rounded-lg overflow-hidden relative w-32 h-32 border border-gray-200 shadow-sm">
                                            <img src={review.image} alt="Review attachment" className="object-cover" />
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center text-gray-500 py-10 font-medium">
                                    No reviews available for this product yet.
                                </div>
                            )}
                        </div>

                        {reviews.length > 0 && (
                            <div className="mt-8 text-center pt-4">
                                <button className="font-bold text-gray-800 hover:text-black transition-colors px-6 py-3 rounded-full text-sm">
                                    Show all {totalReviews} reviews
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
