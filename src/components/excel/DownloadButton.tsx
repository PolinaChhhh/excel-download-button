
import React from 'react';
import { Download, Loader2, Check, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadButtonProps {
  onClick: () => void;
  downloadState: "idle" | "loading" | "analyzing" | "validating" | "success" | "error";
  disabled: boolean;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onClick,
  downloadState,
  disabled,
  className
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={className}
      variant="default"
    >
      {downloadState === "idle" && (
        <>
          <Download className="mr-2 h-4 w-4" />
          Скачать документ с изменениями
        </>
      )}
      
      {downloadState === "loading" && (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Подготовка файла...
        </>
      )}
      
      {downloadState === "analyzing" && (
        <>
          <FileSearch className="mr-2 h-4 w-4 animate-spin" />
          Анализ стилей документа...
        </>
      )}
      
      {downloadState === "validating" && (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Проверка документа...
        </>
      )}
      
      {downloadState === "success" && (
        <>
          <Check className="mr-2 h-4 w-4 text-green-500" />
          Документ скачан
        </>
      )}
      
      {downloadState === "error" && (
        "Ошибка скачивания"
      )}
    </Button>
  );
};

export default DownloadButton;
