
import React from 'react';

interface StyleInfoProps {
  stylesCount: number;
}

const StyleInfo: React.FC<StyleInfoProps> = ({ stylesCount }) => {
  if (stylesCount === 0) return null;
  
  return (
    <div className="text-sm text-green-600">
      ✓ Проанализировано {stylesCount} ячеек со стилями. Все границы и форматирование будут сохранены.
    </div>
  );
};

export default StyleInfo;
