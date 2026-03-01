/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Maps frontend form data to backend API format
 */
export function mapSellerFormToAPI(formData: any): any {
  return {
    accountNumber: formData.accountNumber || "",
    accountType: formData.accountType || "",
    address: formData.address || "",
    bankName: formData.bankName || "",
    businessAccHolderName: formData.businessAccHolderName || "",
    businessAddress: formData.businessAddress || "",
    businessEmail: formData.businessEmail || "",
    businessName: formData.legalBusinessName || "",
    businessPhone: formData.businessPhone || "",
    businessReg: formData.businessRegistrationNo || "",
    businessType: formData.businessType || "",
    categories: formData.categories || [],
    contactAdress: formData.address || "",
    contactEmail: formData.contactEmail || "",
    country: formData.country || "Bangladesh",
    fullName: formData.fullName || "",
    residency: formData.residency || "",
    role: "seller",
    shopDescription: formData.shopDescription || "",
    shopName: formData.shopName || "",
    stripeId: formData.stripeId || "",
    tin: formData.tin || formData.einTinNumber || "",
    zip: formData.zip || "",
    returnPolicy: formData.returnPolicy || "",
    fashion: formData.fashion || false,
    homeLiving: formData.homeLiving || false,
    city: formData.city || "",
    street: formData.street || "",
    swiftCode: formData.swiftCode || "",
  };
}

/**
 * Prepare FormData with files for multipart upload
 */
export async function prepareSellerFormData(formData: any): Promise<FormData> {
  const data = new FormData();

  // Map all text fields
  const mappedData = mapSellerFormToAPI(formData);
  
  Object.keys(mappedData).forEach((key) => {
    if (key === "categories" && Array.isArray(mappedData[key])) {
      mappedData[key].forEach((category: string) => {
        data.append("categories[]", category);
      });
    } else if (typeof mappedData[key] === "boolean") {
      data.append(key, String(mappedData[key]));
    } else {
      data.append(key, mappedData[key]);
    }
  });

  // Append file uploads
  const fileFields = [
    "businessLicense",
    "bankStatement",
    "document",
    "nationalIdFront",
    "nationalIdBack",
    "shopLogo",
  ];

  fileFields.forEach((field) => {
    if (formData[field] instanceof File) {
      data.append(field, formData[field], formData[field].name);
    }
  });

  return data;
}

/**
 * Create a sample payload matching the provided structure
 */
export function createSamplePayload(): any {
  return {
    accountNumber: "123456789",
    accountType: "Savings",
    address: "123 Main Road, Dhaka",
    bankName: "City Bank",
    businessAccHolderName: "nahid Khan",
    businessAddress: "Business Tower, 5th Floor, Dhaka",
    businessEmail: "business@example.com",
    businessName: "Nahid Fashion Hub",
    businessPhone: "+8801711223344",
    businessReg: "BR-2025-001",
    businessType: "Fashion",
    categories: ["Menswear", "Womenswear"],
    contactAdress: "Uttara, Dhaka",
    contactEmail: "contact@example.com",
    country: "Bangladesh",
    fullName: "nahid islam",
    residency: "london",
    role: "seller",
    shopDescription: "We sell top quality clothing products.",
    shopName: "nahid Shop",
    stripeId: "acct_1A2B3C4D5E6F",
    tin: 123456789,
    zip: 1205,
    returnPolicy: "7-day return policy",
    fashion: true,
    homeLiving: false,
    city: "Dhaka",
    street: "Uttara Sector 7",
    swiftCode: "CITYBDDH",
  };
}
