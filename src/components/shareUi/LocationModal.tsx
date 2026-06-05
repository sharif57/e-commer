import React, { useState } from 'react';
import { Target, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export interface LocationData {
  city: string;
  country: string;
  zip?: string;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: LocationData) => void;
}

export default function LocationModal({ isOpen, onClose, onLocationSelect }: LocationModalProps) {
  const [zipCode, setZipCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const extractLocationFromGeocode = (results: any[]): LocationData | null => {
    if (!results || results.length === 0) return null;
    
    let city = '';
    let country = '';
    let state = '';
    
    // Search through all results to find the most accurate city/country
    for (const result of results) {
      if (!result.address_components) continue;
      
      for (const component of result.address_components) {
        if (!city && (component.types.includes('locality') || component.types.includes('postal_town'))) {
          city = component.long_name;
        }
        if (!country && component.types.includes('country')) {
          country = component.short_name;
        }
        if (!state && component.types.includes('administrative_area_level_1')) {
          state = component.short_name;
        }
      }
    }
    
    // Fallback if exact city not found
    if (!city) {
      for (const result of results) {
        if (!result.address_components) continue;
        for (const component of result.address_components) {
          if (!city && (component.types.includes('administrative_area_level_2') || component.types.includes('neighborhood') || component.types.includes('sublocality'))) {
            city = component.long_name;
          }
        }
      }
    }

    if (!city && !country) return null;

    return {
      city: city || state || 'Unknown',
      country: country || 'Unknown'
    };
  };

  const handleZipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim()) return;

    setIsLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) throw new Error("Google Maps API key is missing from environment variables.");

      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${zipCode}&key=${apiKey}`);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const loc = extractLocationFromGeocode(data.results);
        if (loc) {
          loc.zip = zipCode;
          onLocationSelect(loc);
          onClose();
          toast.success(`Location updated to ${loc.city}, ${loc.country}`);
        } else {
          toast.error("Could not precisely determine city for this zip code.");
        }
      } else {
        toast.error("Invalid zip code or location not found.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to fetch location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
          if (!apiKey) throw new Error("Google Maps API key is missing from environment variables.");

          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
          const data = await response.json();

          if (data.status === 'OK' && data.results.length > 0) {
            const loc = extractLocationFromGeocode(data.results);
            if (loc) {
              onLocationSelect(loc);
              onClose();
              toast.success(`Location updated to ${loc.city}, ${loc.country}`);
            } else {
              toast.error("Could not determine city from your location.");
            }
          } else {
             toast.error("Location not found via coordinates.");
          }
        } catch (error: any) {
          console.error(error);
          toast.error(error.message || "Failed to fetch location from coordinates.");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setIsLoading(false);
        toast.error("Permission denied or unable to retrieve location.");
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm md:max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 text-lg">Choose your location</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors rounded-md p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Delivery options and delivery speeds may vary for different locations.
          </p>

          <button 
            onClick={handleUseCurrentLocation}
            disabled={isLoading}
            className="w-full bg-[#E3E6E6] hover:bg-[#D5D9D9] text-black border border-gray-300 rounded-lg py-2.5 px-4 font-semibold text-sm transition-colors flex items-center justify-center gap-2 mb-6 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-gray-600" /> : <Target className="w-4 h-4 text-gray-700" />}
            Use current location
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-semibold tracking-wider">or enter a zip code</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleZipSubmit} className="mt-6 flex gap-2">
            <input 
              type="text" 
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="e.g. 10001"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#F2C94C] focus:ring-1 focus:ring-[#F2C94C] transition-colors"
            />
            <button 
              type="submit"
              disabled={isLoading || !zipCode.trim()}
              className="bg-white border border-gray-300 shadow-sm hover:bg-gray-50 text-black px-6 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
