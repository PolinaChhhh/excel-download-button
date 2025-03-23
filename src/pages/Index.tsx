
import React, { useState } from "react";
import ExcelDownloadButton from "@/components/ExcelDownloadButton";

// Sample data that would be converted to Excel
const sampleFormData = {
  personal: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890"
  },
  shipping: {
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    country: "USA"
  },
  items: [
    { id: 1, name: "Product A", quantity: 2, price: 24.99 },
    { id: 2, name: "Product B", quantity: 1, price: 49.99 }
  ]
};

const Index = () => {
  // Mock function for downloading the Excel file
  const handleDownloadExcel = async (): Promise<Blob> => {
    // Simulating an API call or processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would use a library like xlsx or exceljs
    // to convert the data to an Excel file
    return new Blob(
      [JSON.stringify(sampleFormData, null, 2)], 
      { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#f8f8f8] to-[#ffffff] px-4 py-12">
      <div className="w-full max-w-lg animate-scale-in">
        <div className="mb-6 text-center">
          <span className="mb-2 inline-block rounded-full bg-[#f5f5f5] px-3 py-1 text-xs font-medium text-[#666]">
            Form Data
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#333]">
            Export Your Data
          </h1>
          <p className="mt-2 text-[#666]">
            Download your form data as an Excel file with a single click.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-[#0000000f]">
          <div className="mb-6 space-y-4">
            <h2 className="text-lg font-medium text-[#333]">Form Summary</h2>
            
            <div className="space-y-3 rounded-lg bg-[#f9f9f9] p-4">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm text-[#666]">Name:</span>
                <span className="text-sm font-medium">{sampleFormData.personal.firstName} {sampleFormData.personal.lastName}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm text-[#666]">Email:</span>
                <span className="text-sm font-medium">{sampleFormData.personal.email}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm text-[#666]">Shipping:</span>
                <span className="text-sm font-medium">{sampleFormData.shipping.address}, {sampleFormData.shipping.city}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm text-[#666]">Items:</span>
                <span className="text-sm font-medium">{sampleFormData.items.length} products</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <ExcelDownloadButton 
              filename="form-data.xlsx"
              onDownload={handleDownloadExcel}
              data={sampleFormData}
            />
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-[#666]">
          <p>
            Your data is formatted according to Excel standards for easy viewing and analysis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
