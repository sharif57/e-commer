"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactSelect, { SingleValue } from "react-select";
import { Country } from "country-state-city";
import Stripe from "@/components/icon/stripe";
import Mastercard from "@/components/icon/masterCard";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
    useAddBankCardMutation,
    useGetMyCardQuery,
    useConnectCardMutation,
    useDeleteBankCardMutation,
} from "@/redux/feature/bankSlice";

interface CardData {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    nameOnCard: string;
    country: string;
    zipCode: string;
}

interface CountryOption {
    value: string;
    label: string;
}

export default function MyCardAdd() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<CardData>({
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        nameOnCard: "",
        country: "United States",
        zipCode: "",
    });

    const { data: cardData, isLoading: isCardsLoading } = useGetMyCardQuery(undefined);
    const [addBankCard, { isLoading: isAddingCard }] = useAddBankCardMutation();
    const [connectCard, { isLoading: isConnectingCard }] = useConnectCardMutation();
    const [deleteBankCard, { isLoading: isDeletingCard }] = useDeleteBankCardMutation();

    const savedCards = cardData?.data || [];

    const countryOptions = React.useMemo<CountryOption[]>(
        () => Country.getAllCountries().map((country) => ({ value: country.isoCode, label: country.name })),
        []
    );

    const getCardType = (cardNumber: string) => {
        if (!cardNumber) return "Credit Card";
        const cleanNum = cardNumber.replace(/\s/g, "");
        if (cleanNum.startsWith("4")) return "Visa";
        if (cleanNum.startsWith("5")) return "Mastercard";
        if (cleanNum.startsWith("3")) return "Amex";
        return "Credit Card";
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === "cardNumber") {
            processedValue = value.replace(/\s/g, "").slice(0, 16);
            processedValue = processedValue.replace(/(\d{4})/g, "$1 ").trim();
        } else if (name === "expiryDate") {
            processedValue = value.replace(/\D/g, "").slice(0, 4);
            if (processedValue.length >= 2) {
                processedValue = processedValue.slice(0, 2) + "/" + processedValue.slice(2);
            }
        } else if (name === "cvc") {
            processedValue = value.replace(/\D/g, "").slice(0, 3);
        } else if (name === "zipCode") {
            processedValue = value.replace(/\D/g, "").slice(0, 10);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: processedValue,
        }));
    };

    const handleCountryChange = (option: SingleValue<CountryOption>) => {
        setFormData((prev) => ({
            ...prev,
            country: option?.label ?? "",
        }));
    };

    const handleAddCard = async () => {
        if (
            formData.cardNumber &&
            formData.expiryDate &&
            formData.cvc &&
            formData.nameOnCard &&
            formData.country &&
            formData.zipCode
        ) {
            try {
                const cleanCardNumber = formData.cardNumber.replace(/\s/g, "");
                const cardPayload = {
                    cardNumber: cleanCardNumber,
                    expiryDate: formData.expiryDate,
                    cvc: formData.cvc,
                    name: formData.nameOnCard,
                    country: formData.country,
                    zipCode: formData.zipCode,
                };
                const res = await addBankCard(cardPayload).unwrap();
                toast.success(res?.message || "Card added successfully");

                setFormData({
                    cardNumber: "",
                    expiryDate: "",
                    cvc: "",
                    nameOnCard: "",
                    country: "United States",
                    zipCode: "",
                });
                setIsModalOpen(false);
            } catch (err: any) {
                toast.error(err?.data?.message || "Failed to add card");
            }
        } else {
            toast.error("Please fill all required fields");
        }
    };

    const handleToggleStatus = async (cardId: string, currentStatus: string) => {
        const nextStatus = currentStatus === "connected" ? "disconnected" : "connected";
        try {
            const res = await connectCard({
                id: cardId,
                data: { status: nextStatus },
            }).unwrap();
            toast.success(res?.message || `Card status updated to ${nextStatus}`);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update card status");
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        try {
            const res = await deleteBankCard(cardId).unwrap();
            toast.success(res?.message || "Card deleted successfully");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete card");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            {/* Container */}
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">My cards</h1>
                </div>

                {/* Main Card Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Stripe Section Header */}
                    <div className="p-6 sm:p-8 border-b border-gray-100">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-indigo-600 text-white font-bold text-lg">
                                    <Stripe />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Stripe payout details</h2>
                                <p className="text-sm text-gray-600 mt-1">Manage your payout preferences & connected accounts.</p>
                            </div>
                        </div>
                    </div>

                    {/* Cards List */}
                    <div className="p-6 sm:p-8 space-y-4">
                        {isCardsLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <span className="ml-2 text-gray-600">Loading cards...</span>
                            </div>
                        ) : savedCards.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                No cards added yet.
                            </div>
                        ) : (
                            savedCards.map((card: any) => {
                                const cardType = getCardType(card.cardNumber);
                                const lastFour = card.cardNumber?.slice(-4) || "";
                                return (
                                    <div key={card._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-[#1C1C1C0F] rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                                        {/* Card Info */}
                                        <div className="flex items-start gap-4 min-w-0">
                                            <div className="size-[50px] flex-shrink-0 mt-2">
                                                <Mastercard />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-base sm:text-lg font-medium text-gray-900">{cardType}</h3>
                                                <p className="text-sm text-gray-600">Account ending in •••••••• {lastFour}</p>
                                                <p className="text-xs text-gray-500 mt-1">Cardholder: {card.name}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <span
                                                className={`px-3 py-2 rounded-md text-sm font-medium flex-1 sm:flex-none text-center transition-colors ${card.status === "connected"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-700"
                                                    }`}
                                            >
                                                {card.status === "connected" ? "Connected" : "Disconnected"}
                                            </span>
                                            <Button
                                                onClick={() => handleToggleStatus(card._id, card.status)}
                                                variant="outline"
                                                className="border-gray-200 text-sm hover:bg-gray-50"
                                                disabled={isConnectingCard}
                                            >
                                                {card.status === "connected" ? "Disconnect" : "Connect"}
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteCard(card._id)}
                                                variant="destructive"
                                                className="text-white text-sm"
                                                disabled={isDeletingCard}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Add New Card Button */}
                    <div className="p-6 sm:p-8 border-t border-gray-100">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-3 sm:py-4 px-4 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-blue-600 font-medium text-base sm:text-lg"
                        >
                            <span className="text-xl">+</span>
                            Add a new card
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Card Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-full max-w-md mx-auto p-4 sm:p-6 rounded-lg">
                    <DialogHeader className="relative pb-4 border-b border-gray-200">
                        <div className="pr-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Add a card</h2>
                            <p className="text-sm text-gray-600 mt-2">
                                Add your card information to ensure it&#39;s your details here.
                            </p>
                        </div>
                    </DialogHeader>

                    {/* Form */}
                    <div className="space-y-4 sm:space-y-5 pt-4">
                        {/* Card Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Card number <span className="text-red-500">*</span></label>
                            <Input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                placeholder="Enter card number"
                                maxLength={19}
                                required
                                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="flex gap-2 mt-2 justify-end text-xs">
                                <span className="w-8 h-5 border border-gray-300 rounded flex items-center justify-center text-gray-400">Visa</span>
                                <span className="w-8 h-5 border border-gray-300 rounded flex items-center justify-center text-gray-400">MC</span>
                                <span className="w-8 h-5 border border-gray-300 rounded flex items-center justify-center text-gray-400">AmEx</span>
                            </div>
                        </div>

                        {/* Row: Expiry and CVC */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Expiry <span className="text-red-500">*</span></label>
                                <Input
                                    type="text"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    required
                                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">CVC <span className="text-red-500">*</span></label>
                                <Input
                                    type="text"
                                    name="cvc"
                                    value={formData.cvc}
                                    onChange={handleInputChange}
                                    placeholder="•••"
                                    maxLength={3}
                                    required
                                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Name on Card */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card <span className="text-red-500">*</span></label>
                            <Input
                                type="text"
                                name="nameOnCard"
                                value={formData.nameOnCard}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        nameOnCard: e.target.value,
                                    }))
                                }
                                placeholder="Enter the name"
                                required
                                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Country Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Country <span className="text-red-500">*</span></label>
                            <ReactSelect
                                options={countryOptions}
                                value={countryOptions.find((option) => option.label === formData.country) ?? null}
                                onChange={handleCountryChange}
                                placeholder="Select country"
                                className="text-sm"
                                classNamePrefix="country-select"
                                isSearchable
                            />
                        </div>

                        {/* ZIP Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code <span className="text-red-500">*</span></label>
                            <Input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                placeholder="47987"
                                maxLength={10}
                                required
                                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Add Card Button */}
                        <Button
                            onClick={handleAddCard}
                            disabled={isAddingCard}
                            className="w-full py-3 sm:py-4 mt-6 bg-primary hover:bg-green-700 text-white font-semibold rounded-md transition-colors text-base flex items-center justify-center gap-2"
                        >
                            {isAddingCard && <Loader2 className="w-5 h-5 animate-spin" />}
                            Add my card
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
