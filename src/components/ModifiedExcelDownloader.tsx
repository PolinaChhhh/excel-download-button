
import React, { useState } from 'react';
import { Download, Loader2, Check, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface ModifiedExcelDownloaderProps {
  data: any;
  originalFile?: File;
  filename?: string;
  className?: string;
  customCellText?: string;
}

interface CellStyle {
  address: string;
  style: any;
  borders?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  };
  font?: any;
  fill?: any;
}

const ModifiedExcelDownloader: React.FC<ModifiedExcelDownloaderProps> = ({
  data,
  originalFile,
  filename = "modified-document.xlsx",
  className,
  customCellText = "ПОПКА"
}) => {
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "analyzing" | "success" | "error">("idle");
  const [cellStyles, setCellStyles] = useState<CellStyle[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const analyzeDocument = async () => {
    if (!originalFile) return;
    
    setDownloadState("analyzing");
    toast.info("Анализ стилей документа...");
    
    try {
      // Чтение оригинального файла
      const fileReader = new FileReader();
      
      fileReader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // Преобразуем в бинарную строку для лучшей совместимости
          const data = new Uint8Array(arrayBuffer);
          const arr = new Array();
          for (let i = 0; i < data.length; i++) {
            arr[i] = String.fromCharCode(data[i]);
          }
          const bstr = arr.join("");
          
          // Парсим Excel файл с максимальным сохранением форматирования
          const workbook = XLSX.read(bstr, { 
            type: 'binary',
            cellStyles: true,   
            cellDates: true,    
            cellNF: true,       
            cellFormula: true,  
            bookVBA: true,      
            WTF: true           
          });
          
          // Получаем первый лист
          const wsName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[wsName];
          
          // Анализируем стили ячеек
          const styleCells: CellStyle[] = [];
          const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:Z100');
          
          for (let r = range.s.r; r <= range.e.r; r++) {
            for (let c = range.s.c; c <= range.e.c; c++) {
              const cellAddress = XLSX.utils.encode_cell({r: r, c: c});
              const cell = worksheet[cellAddress];
              
              if (cell && cell.s) {
                const borders = {
                  top: cell.s.border?.top?.style !== undefined,
                  right: cell.s.border?.right?.style !== undefined,
                  bottom: cell.s.border?.bottom?.style !== undefined,
                  left: cell.s.border?.left?.style !== undefined
                };
                
                styleCells.push({
                  address: cellAddress,
                  style: cell.s,
                  borders: borders,
                  font: cell.s.font,
                  fill: cell.s.fill
                });
              }
            }
          }
          
          setCellStyles(styleCells);
          setHasAnalyzed(true);
          setDownloadState("idle");
          
          // Вывод ячеек с границами
          const cellsWithBorders = styleCells.filter(cell => 
            cell.borders?.top || cell.borders?.right || 
            cell.borders?.bottom || cell.borders?.left
          );
          
          console.log("Ячейки с границами:", cellsWithBorders.map(c => c.address));
          
          // Специально проверяем ячейку A3
          const a3Cell = styleCells.find(cell => cell.address === 'A3');
          if (a3Cell) {
            console.log("Стиль ячейки A3:", a3Cell);
          } else {
            console.log("Ячейка A3 не имеет специальных стилей");
          }
          
          toast.success("Анализ документа завершен. Найдено " + styleCells.length + " ячеек со стилями.");
          
        } catch (error) {
          console.error("Ошибка при анализе Excel файла:", error);
          setDownloadState("error");
          toast.error("Ошибка при анализе файла");
          
          setTimeout(() => {
            setDownloadState("idle");
          }, 2000);
        }
      };
      
      fileReader.onerror = () => {
        console.error("Ошибка чтения файла");
        setDownloadState("error");
        toast.error("Ошибка при чтении файла");
        
        setTimeout(() => {
          setDownloadState("idle");
        }, 2000);
      };
      
      fileReader.readAsArrayBuffer(originalFile);
    } catch (error) {
      console.error("Ошибка анализа:", error);
      setDownloadState("error");
      toast.error("Ошибка при анализе файла");
      
      setTimeout(() => {
        setDownloadState("idle");
      }, 2000);
    }
  };

  const handleDownload = async () => {
    if (downloadState === "loading" || !originalFile) return;
    
    setDownloadState("loading");
    toast.info("Подготовка документа с изменениями...");
    
    try {
      // Read the original file
      const fileReader = new FileReader();
      
      fileReader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // Сначала преобразуем в бинарную строку для лучшей совместимости
          const data = new Uint8Array(arrayBuffer);
          const arr = new Array();
          for (let i = 0; i < data.length; i++) {
            arr[i] = String.fromCharCode(data[i]);
          }
          const bstr = arr.join("");
          
          // Parse the Excel file с максимальным сохранением форматирования
          const workbook = XLSX.read(bstr, { 
            type: 'binary',
            cellStyles: true,   // Важно для стилей ячеек
            cellDates: true,    // Сохранение форматов дат
            cellNF: true,       // Сохранение числовых форматов
            cellFormula: true,  // Сохранение формул
            bookVBA: true,      // Сохранение VBA кода
            WTF: true           // Парсинг всех неизвестных свойств
          });
          
          // Get the first worksheet
          const wsName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[wsName];
          
          // Логируем стили для отладки
          console.log("Анализ стилей в документе");
          
          // Применение специальных стилей
          cellStyles.forEach(cellStyle => {
            const cell = worksheet[cellStyle.address];
            if (cell) {
              // Сохраняем все стили
              cell.s = cellStyle.style;
            }
          });
          
          // Особое внимание на ячейку A3
          if (worksheet['A3']) {
            console.log("Проверка ячейки A3 перед сохранением:", worksheet['A3']);
            // Убедимся, что нижняя граница сохранена
            if (worksheet['A3'].s && !worksheet['A3'].s.border) {
              worksheet['A3'].s.border = {
                bottom: { style: 'thin', color: { rgb: "000000" } }
              };
            }
          }
          
          // Получаем все свойства ячейки AD18
          const cellAddress = "AD18";
          const originalCell = worksheet[cellAddress] || {};
          
          // Сохраняем все оригинальные свойства и метаданные
          const cellStyle = originalCell.s || {}; 
          
          // Создаем полный объект ячейки сохраняя все свойства
          worksheet[cellAddress] = {
            ...originalCell,        // Сохраняем все исходные свойства
            v: customCellText,      // Устанавливаем сырое значение
            w: customCellText,      // Устанавливаем форматированный текст
            t: 's',                 // Тип: строка
            s: cellStyle,           // Стиль: сохраняем исходный стиль включая границы, шрифт и т.д.
          };
          
          // Проверка и логирование наличия важных свойств форматирования листа
          console.log("Ширина столбцов:", worksheet['!cols']); 
          console.log("Высота строк:", worksheet['!rows']);
          console.log("Объединенные ячейки:", worksheet['!merges']);
          
          // Запись измененной книги в буфер с полным сохранением форматирования
          const wbout = XLSX.write(workbook, { 
            bookType: 'xlsx', 
            type: 'binary',
            cellStyles: true,     // Очень важно для сохранения стилей
            compression: true
          });
          
          // Конвертация бинарной строки в массив байтов
          const s2ab = (s: string) => {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) {
              view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buf;
          };
          
          // Создаем blob из буфера
          const blob = new Blob([s2ab(wbout)], { 
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
          });
          
          // Создаем ссылку для скачивания
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          link.click();
          
          // Очистка ресурсов
          URL.revokeObjectURL(url);
          
          setDownloadState("success");
          toast.success(`Документ успешно скачан с сохранением всех стилей и границ. Ячейка AD18: "${customCellText}"`);
          
          // Сбросить статус через 2 секунды
          setTimeout(() => {
            setDownloadState("idle");
          }, 2000);
        } catch (error) {
          console.error("Ошибка при обработке Excel файла:", error);
          setDownloadState("error");
          toast.error("Ошибка при обработке файла");
          
          setTimeout(() => {
            setDownloadState("idle");
          }, 2000);
        }
      };
      
      fileReader.onerror = () => {
        console.error("Ошибка чтения файла");
        setDownloadState("error");
        toast.error("Ошибка при чтении файла");
        
        setTimeout(() => {
          setDownloadState("idle");
        }, 2000);
      };
      
      fileReader.readAsArrayBuffer(originalFile);
    } catch (error) {
      console.error("Ошибка скачивания:", error);
      setDownloadState("error");
      toast.error("Ошибка при скачивании файла");
      
      // Сбросить статус через 2 секунды
      setTimeout(() => {
        setDownloadState("idle");
      }, 2000);
    }
  };

  return (
    <div className="space-y-3">
      {!hasAnalyzed && originalFile && (
        <Button
          onClick={analyzeDocument}
          disabled={downloadState !== "idle" || !originalFile}
          className={className}
          variant="outline"
        >
          {downloadState === "analyzing" ? (
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
      )}
      
      {(hasAnalyzed || !originalFile) && (
        <Button
          onClick={handleDownload}
          disabled={downloadState === "loading" || !originalFile || (!hasAnalyzed && originalFile)}
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
      )}
      
      {hasAnalyzed && cellStyles.length > 0 && (
        <div className="text-sm text-green-600">
          ✓ Проанализировано {cellStyles.length} ячеек со стилями. Все границы и форматирование будут сохранены.
        </div>
      )}
    </div>
  );
};

export default ModifiedExcelDownloader;
