"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

export default function Barcode() {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, "1234", {
        format: "pharmacode",
        lineColor: "#000",      // premium deep-blue
        width: 4,                  // thicker, premium look
        height: 60,                // slightly taller
        margin: 10,                // clean spacing
        background: "transparent", // modern look
        displayValue: false,
      });
    }
  }, []);

  return (
    <div className="flex justify-center items-center p-4">
      <svg ref={barcodeRef}></svg>
    </div>
  );
}
