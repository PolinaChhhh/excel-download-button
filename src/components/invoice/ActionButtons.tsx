
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ActionButtonsProps {
  onPrint: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onPrint }) => {
  const handleSave = () => {
    toast.success("Форма сохранена!");
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={onPrint}
      >
        <Printer className="h-4 w-4" />
        <span>Печать</span>
      </Button>
      <Button 
        className="flex items-center gap-2"
        onClick={handleSave}
      >
        <Save className="h-4 w-4" />
        <span>Сохранить</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
