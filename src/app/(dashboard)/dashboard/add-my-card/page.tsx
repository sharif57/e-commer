"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactSelect, { SingleValue } from "react-select";
import { Country } from "country-state-city";
import Stripe from "@/components/icon/stripe";
import Mastercard from "@/components/icon/masterCard";

interface CardData {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    nameOnCard: string;
    country: string;
    zipCode: string;
}

interface SavedCard {
    id: string;
    type: string;
    lastFour: string;
    status: "connected" | "disconnected";
    icon: React.ReactNode;
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

    const [savedCards, setSavedCards] = useState<SavedCard[]>([
        {
            id: "1",
            type: "Mastercard",
            lastFour: "25645",
            status: "connected",
            icon: (
                <div className="flex items-center justify-center w-8 h-8 rounded bg-red-500">
                    <span className="text-white font-bold text-xs">MC</span>
                </div>
            ),
        },
    ]);

    const countryOptions = React.useMemo<CountryOption[]>(
        () => Country.getAllCountries().map((country) => ({ value: country.isoCode, label: country.name })),
        []
    );

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

    const handleAddCard = () => {
        if (
            formData.cardNumber &&
            formData.expiryDate &&
            formData.cvc &&
            formData.nameOnCard &&
            formData.country &&
            formData.zipCode
        ) {
            const lastFour = formData.cardNumber.slice(-4).trim();
            setSavedCards([
                ...savedCards,
                {
                    id: Math.random().toString(),
                    type: "Mastercard",
                    lastFour: lastFour,
                    status: "connected",
                    icon: (
                        <div className="flex items-center justify-center w-8 h-8 rounded bg-red-500">
                            <span className="text-white font-bold text-xs">MC</span>
                        </div>
                    ),
                },
            ]);

            setFormData({
                cardNumber: "",
                expiryDate: "",
                cvc: "",
                nameOnCard: "",
                country: "United States",
                zipCode: "",
            });
            setIsModalOpen(false);
        }
    };

    const handleToggleStatus = (cardId: string) => {
        setSavedCards(
            savedCards.map((card) =>
                card.id === cardId
                    ? {
                        ...card,
                        status: card.status === "connected" ? "disconnected" : "connected",
                    }
                    : card
            )
        );
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
                        {savedCards.map((card) => (
                            <div key={card.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-[#1C1C1C0F] rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                                {/* Card Info */}
                                <div className="flex items-start gap-4 min-w-0" >
                                    <div className="size-[50px] flex-shrink-0 mt-2">
                                        <Mastercard />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-base sm:text-lg font-medium text-gray-900">{card.type}</h3>
                                        <p className="text-sm text-gray-600">Account ending in •••••••• {card.lastFour}</p>
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
                                        onClick={() => handleToggleStatus(card.id)}
                                        variant="outline"
                                        className="text-red-600 border-red-200 hover:bg-red-50 text-sm"
                                    >
                                        {card.status === "connected" ? "Disconnect" : "Connect"}
                                    </Button>
                                </div>
                            </div>
                        ))}
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
                        {/* <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-0 top-0 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button> */}
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
                            className="w-full py-3 sm:py-4 mt-6 bg-primary hover:bg-green-700 text-white font-semibold rounded-md transition-colors text-base"
                        >
                            Add my card
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
