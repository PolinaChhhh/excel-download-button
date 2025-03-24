
import React from 'react';
import { useExcelDownloader } from '@/hooks/useExcelDownloader';
import AnalyzeButton from '@/components/excel/AnalyzeButton';
import DownloadButton from '@/components/excel/DownloadButton';
import StyleInfo from '@/components/excel/StyleInfo';
import ValidationResults from '@/components/excel/ValidationResults';
import ValidationButton from '@/components/excel/ValidationButton';
import type { ExcelDownloaderProps } from '@/types/excel';

const ModifiedExcelDownloader: React.FC<ExcelDownloaderProps> = ({
  data,
  originalFile,
  filename = "modified-document.xlsx",
  className,
  customCellText = "ПОПКА"
}) => {
  const { 
    state: { 
      downloadState, 
      cellStyles, 
      cellContents, 
      hasAnalyzed, 
      hasValidated, 
      validationResults 
    }, 
    analyzeDocument, 
    validateDocument, 
    handleDownload 
  } = useExcelDownloader(filename);

  return (
    <div className="space-y-3">
      {!hasAnalyzed && originalFile && (
        <AnalyzeButton 
          onClick={() => analyzeDocument(originalFile)}
          isAnalyzing={downloadState === "analyzing"}
          disabled={downloadState !== "idle" || !originalFile}
          className={className}
        />
      )}
      
      {hasAnalyzed && !hasValidated && originalFile && (
        <ValidationButton 
          onClick={() => validateDocument(originalFile)}
          isValidating={downloadState === "validating"}
          disabled={downloadState !== "idle" || !originalFile}
          className={className}
        />
      )}
      
      {hasValidated && originalFile && (
        <DownloadButton 
          onClick={() => handleDownload(originalFile, customCellText)}
          downloadState={downloadState}
          disabled={downloadState === "loading" || !originalFile}
          className={className}
        />
      )}
      
      {hasAnalyzed && <StyleInfo stylesCount={cellStyles.length} cellContents={cellContents} />}
      
      {hasValidated && <ValidationResults validationResults={validationResults} />}
    </div>
  );
};

export default ModifiedExcelDownloader;
