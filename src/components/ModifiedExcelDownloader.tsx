
import React, { useState } from 'react';
import { Download, Loader2, Check } from 'lucide-react';
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

const ModifiedExcelDownloader: React.FC<ModifiedExcelDownloaderProps> = ({
  data,
  originalFile,
  filename = "modified-document.xlsx",
  className,
  customCellText = "ПОПКА"
}) => {
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "success" | "error">("idle");

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
          
          // Подробный вывод информации о структуре для отладки
          console.log("Информация о книге:", workbook);
          console.log("Свойства листа:", Object.keys(worksheet));
          console.log("Ячейка AD18 до изменения:", worksheet["AD18"]);
          
          // Получаем все свойства ячейки
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
          
          // Детальный лог измененной ячейки
          console.log("Ячейка AD18 после изменения:", worksheet[cellAddress]);
          
          // Проверка и логирование наличия важных свойств форматирования листа
          console.log("Ширина столбцов:", worksheet['!cols']); 
          console.log("Высота строк:", worksheet['!rows']);
          console.log("Объединенные ячейки:", worksheet['!merges']);
          console.log("Диапазон данных:", worksheet['!ref']);
          
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
          toast.success(`Документ успешно скачан с заполненной ячейкой AD18: "${customCellText}"`);
          
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
    <Button
      onClick={handleDownload}
      disabled={downloadState === "loading" || !originalFile}
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
  );
};

export default ModifiedExcelDownloader;
