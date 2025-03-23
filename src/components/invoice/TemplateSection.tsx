
import React from 'react';
import InvoiceTemplateExporter from "@/components/InvoiceTemplateExporter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';

const TemplateSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="h-full">
      <CardHeader className={`${isMobile ? 'pb-2' : 'pb-4'}`}>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>
          Скачать шаблоны
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InvoiceTemplateExporter />
      </CardContent>
    </Card>
  );
};

export default TemplateSection;
