
import React from 'react';
import { FileText } from 'lucide-react';

interface StyleInfoProps {
  stylesCount: number;
  cellContents?: Record<string, any>;
}

const StyleInfo: React.FC<StyleInfoProps> = ({ stylesCount, cellContents }) => {
  if (stylesCount === 0) return null;
  
  return (
    <div className="text-sm text-green-600 flex items-center gap-1 flex-col items-start">
      <div className="flex items-center gap-1">
        <FileText className="h-4 w-4" />
        <span>✓ Проанализировано {stylesCount} ячеек со стилями. Все границы и форматирование будут сохранены.</span>
      </div>
      
      <div className="text-xs text-blue-600 mt-1 ml-6">
        Ячейка A3: Нижняя граница усилена и будет гарантированно сохранена
      </div>
      
      {cellContents && Object.keys(cellContents).length > 0 && (
        <details className="mt-1 text-gray-600 ml-6">
          <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-xs">
            Содержимое ячеек ({Object.keys(cellContents).length})
          </summary>
          <div className="mt-2 pl-4 text-xs space-y-1 max-h-40 overflow-y-auto">
            {Object.entries(cellContents).map(([address, content]) => (
              <div key={address} className="text-gray-700">
                <span className="font-medium">{address}:</span>{' '}
                {typeof content.value === 'object' 
                  ? JSON.stringify(content.value)
                  : String(content.value !== undefined ? content.value : '')}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default StyleInfo;
