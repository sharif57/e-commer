/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AddressData {
  firstName?: string | null
  lastName?: string | null
  streetName?: string | null
  area?: string | null
  city?: string | null
  zip?: string | number | null
  state?: string | null
  country?: string | null
  billingAddress?: string | null
}

const REQUIRED_FIELDS: (keyof AddressData)[] = [
  "firstName",
  "lastName",
  "streetName",
  "area",
  "city",
  "zip",
  "country",
  "billingAddress",
]

/**
 * Validates if all required address fields are present and not empty
 * @param addressData - Address data to validate
 * @returns Object with isValid boolean and array of missing field names
 */
export const validateDeliveryAddress = (addressData: AddressData) => {
  const missingFields: string[] = []

  REQUIRED_FIELDS.forEach((field) => {
    const value = addressData[field]
    // Check if field is empty, null, undefined, or only whitespace
    if (value === null || value === undefined || (typeof value === "string" && !value.trim())) {
      missingFields.push(field)
    }
  })

  return {
    isValid: missingFields.length === 0,
    missingFields,
  }
}

/**
 * Formats address data to ensure all fields are strings
 * @param addressData - Address data to format
 * @returns Formatted address data with string values
 */
export const formatAddressData = (addressData: AddressData): AddressData => {
  return {
    firstName: addressData.firstName || "",
    lastName: addressData.lastName || "",
    streetName: addressData.streetName || "",
    area: addressData.area || "",
    city: addressData.city || "",
    zip: addressData.zip ? String(addressData.zip) : "",
    state: addressData.state || "",
    country: addressData.country || "",
    billingAddress: addressData.billingAddress || "",
  }
}
