/* eslint-disable @typescript-eslint/no-explicit-any */
class SellerService {
  /**
   * Validate seller application form
   */
  validateForm(data: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Step 1: Business Details
    if (!data.businessType) errors.businessType = "Business type is required";
    if (!data.legalBusinessName) errors.legalBusinessName = "Legal business name is required";
    if (!data.businessRegistrationNo) errors.businessRegistrationNo = "Business registration number is required";
    if (!data.businessAddress) errors.businessAddress = "Business address is required";
    if (!data.businessPhone) errors.businessPhone = "Business phone is required";
    if (!data.businessEmail) errors.businessEmail = "Business email is required";
    if (!data.einTinNumber) errors.einTinNumber = "EIN/TIN number is required";

    // Step 2: Seller Information
    if (!data.fullName) errors.fullName = "Full name is required";
    if (!data.contactEmail) errors.contactEmail = "Contact email is required";
    if (!data.contactNumber) errors.contactNumber = "Contact number is required";
    if (!data.address) errors.address = "Address is required";

    // Step 3: Shop Details
    if (!data.shopName) errors.shopName = "Shop name is required";

    // Step 4: Payment Details
    if (!data.businessAccHolderName) errors.businessAccHolderName = "Account holder name is required";
    if (!data.bankName) errors.bankName = "Bank name is required";
    if (!data.accountNumber) errors.accountNumber = "Account number is required";
    if (!data.swiftCode) errors.swiftCode = "SWIFT code is required";
    if (!data.accountType) errors.accountType = "Account type is required";
    if (!data.street) errors.street = "Street is required";
    if (!data.city) errors.city = "City is required";
    if (!data.zip) errors.zip = "ZIP code is required";

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Convert value to number safely
   */
  toNumber(value: any, defaultValue: number = 0): number {
    if (value === null || value === undefined || value === "") {
      return defaultValue;
    }
    
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  }

  /**
   * Prepare payload data (without files)
   */
  preparePayloadData(data: any): any {
    const payload = {
      accountNumber: data.accountNumber || "",
      accountType: data.accountType || "",
      address: data.address || "",
      bankName: data.bankName || "",
      businessAccHolderName: data.businessAccHolderName || "",
      businessAddress: data.businessAddress || "",
      businessEmail: data.businessEmail || "",
      businessName: data.legalBusinessName || "",
      businessPhone: data.businessPhone || "",
      businessReg: data.businessRegistrationNo || "",
      businessType: data.businessType || "",
      categories: data.categories || [],
      contactAdress: data.address || "",
      contactEmail: data.contactEmail || "",
      country: data.country || "Bangladesh",
      fullName: data.fullName || "",
      residency: data.residency || "",
      role: "seller",
      shopDescription: data.shopDescription || "",
      shopName: data.shopName || "",
      stripeId: data.stripeId || "",
      tin: this.toNumber(data.tin || data.einTinNumber),
      zip: this.toNumber(data.zip),
      returnPolicy: data.returnPolicy || "",
      fashion: data.fashion || false,
      homeLiving: data.homeLiving || false,
      city: data.city || "",
      street: data.street || "",
      swiftCode: data.swiftCode || "",
    };

    return payload;
  }

  /**
   * Prepare images array from form data
   */
  prepareImages(data: any): File[] {
    const images: File[] = [];

    // Collect all files
    if (data.businessLicense instanceof File) {
      images.push(data.businessLicense);
    }

    if (data.bankStatement instanceof File) {
      images.push(data.bankStatement);
    }

    if (data.document instanceof File) {
      images.push(data.document);
    }

    if (data.nationalIdFront instanceof File) {
      images.push(data.nationalIdFront);
    }

    if (data.nationalIdBack instanceof File) {
      images.push(data.nationalIdBack);
    }

    if (data.shopLogo instanceof File) {
      images.push(data.shopLogo);
    }

    return images;
  }

  /**
   * Prepare complete submission data
   */
  prepareSubmissionData(data: any): { payload: any; images: File[] } {
    const payload = this.preparePayloadData(data);
    const images = this.prepareImages(data);

    return { payload, images };
  }
}

const sellerServiceInstance = new SellerService();
export default sellerServiceInstance;
