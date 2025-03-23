
import React from 'react';
import InvoiceTemplateExporter from "@/components/InvoiceTemplateExporter";

const TemplateSection: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-medium mb-4">Скачать шаблоны</h2>
      <InvoiceTemplateExporter />
    </div>
  );
};

export default TemplateSection;
