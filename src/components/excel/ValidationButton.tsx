
import React from 'react';
import { CheckSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ValidationButtonProps {
  onClick: () => void;
  isValidating: boolean;
  disabled: boolean;
  className?: string;
}

const ValidationButton: React.FC<ValidationButtonProps> = ({
  onClick,
  isValidating,
  disabled,
  className
}) => {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled || isValidating}
      className={className}
      variant="outline"
    >
      {isValidating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Проверка стилей документа...
        </>
      ) : (
        <>
          <CheckSquare className="mr-2 h-4 w-4" />
          Проверить соответствие стилей
        </>
      )}
    </Button>
  );
};

export default ValidationButton;
