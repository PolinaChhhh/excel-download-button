
import React, { useState } from 'react';
import { FileText, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateTemplateExcel } from '@/utils/templateUtils';

interface TemplateDownloaderProps {
  className?: string;
}

const TemplateDownloader: React.FC<TemplateDownloaderProps> = ({ className }) => {
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [customText, setCustomText] = useState<string>("Пример текста пользователя");

  const handleDownload = async () => {
    if (downloadState === "loading") return;
    
    setDownloadState("loading");
    toast.info("Подготовка шаблона Excel...");
    
    try {
      // Add a small delay to give the user feedback that something is happening
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate the Excel file with the custom text
      const blob = generateTemplateExcel(undefined, customText);
      
      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "template-TORG-12.xlsx";
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      setDownloadState("success");
      toast.success("Шаблон Excel успешно скачан");
      
      // Reset after 2 seconds
      setTimeout(() => {
        setDownloadState("idle");
      }, 2000);
    } catch (error) {
      console.error("Ошибка при скачивании шаблона:", error);
      setDownloadState("error");
      toast.error("Ошибка при скачивании шаблона");
      
      // Reset after 2 seconds
      setTimeout(() => {
        setDownloadState("idle");
      }, 2000);
    }
  };

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <Label htmlFor="template-text" className="mb-2 block">
          Текст для ячейки A4:
        </Label>
        <Input
          id="template-text"
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Введите текст для ячейки A4"
          className="w-full"
        />
      </div>
      
      <Button
        onClick={handleDownload}
        disabled={downloadState === "loading"}
        className={className}
        variant="outline"
      >
        {downloadState === "idle" && (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Скачать пример шаблона
          </>
        )}
        
        {downloadState === "loading" && (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Подготовка шаблона...
          </>
        )}
        
        {downloadState === "success" && (
          <>
            <Check className="mr-2 h-4 w-4 text-green-500" />
            Шаблон скачан
          </>
        )}
        
        {downloadState === "error" && (
          "Ошибка скачивания"
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground">
        Скачайте пример шаблона ТОРГ-12 с вашим пользовательским текстом в ячейке A4.
        Шаблон содержит настроенные размеры строк, столбцов и объединенные ячейки согласно формату.
      </p>
    </div>
  );
};

export default TemplateDownloader;
