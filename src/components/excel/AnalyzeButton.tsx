
import React from 'react';
import { FileSearch, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyzeButtonProps {
  onClick: () => void;
  isAnalyzing: boolean;
  disabled: boolean;
  className?: string;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({
  onClick,
  isAnalyzing,
  disabled,
  className
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isAnalyzing}
      className={className}
      variant="outline"
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Анализ стилей документа...
        </>
      ) : (
        <>
          <FileSearch className="mr-2 h-4 w-4" />
          Проанализировать стили документа
        </>
      )}
    </Button>
  );
};

export default AnalyzeButton;
