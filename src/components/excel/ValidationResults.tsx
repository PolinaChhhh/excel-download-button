
import React from 'react';
import { ValidationSummary } from '@/types/excel';
import { Check, AlertCircle } from 'lucide-react';

interface ValidationResultsProps {
  validationResults?: ValidationSummary | null;
}

const ValidationResults: React.FC<ValidationResultsProps> = ({ validationResults }) => {
  if (!validationResults) return null;
  
  const { isValid, totalCells, validCells, invalidCells } = validationResults;
  
  return (
    <div className="text-sm mt-2">
      {isValid ? (
        <div className="text-green-600 flex items-center gap-1">
          <Check className="h-4 w-4" />
          <span>Проверка прошла успешно. Все {totalCells} ячеек со стилями соответствуют оригиналу.</span>
        </div>
      ) : (
        <div className="text-amber-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          <span>Внимание: {invalidCells} из {totalCells} ячеек имеют отличия от оригинала.</span>
        </div>
      )}
      
      {!isValid && invalidCells > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
            Показать проблемные ячейки ({invalidCells})
          </summary>
          <div className="mt-2 pl-4 text-xs space-y-1 max-h-32 overflow-y-auto">
            {validationResults.cellResults
              .filter(result => !result.isValid)
              .map(cell => (
                <div key={cell.address} className="text-gray-700">
                  <span className="font-medium">{cell.address}:</span> {cell.issues?.join(', ')}
                </div>
              ))
            }
          </div>
        </details>
      )}
    </div>
  );
};

export default ValidationResults;
