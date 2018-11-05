import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {
  constructor() { }
  
  private keys = [];

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    console.log(json);
    // var workbook: XLSX.WorkBook;
    var worksheet: XLSX.WorkSheet[] = [];
    for(var i = 0; i < json.length; i++){
      worksheet.push(XLSX.utils.json_to_sheet(json[i]));
      // workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    };

    const workbook: XLSX.WorkBook = { 
      Sheets: { 
        'Alam Sutera': worksheet[0], 
        'Bekasi': worksheet[1],
        'Bogor': worksheet[2], 
        'Kelapa Gading': worksheet[3],
        'Pondok Indah': worksheet[4], 
        'Wisma Asia': worksheet[5],
      },
      SheetNames: [
        'Alam Sutera', 
        'Bekasi',
        'Bogor', 
        'Kelapa Gading',
        'Pondok Indah', 
        'Wisma Asia',
      ] 
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});

    FileSaver.saveAs(data, fileName + '_export_' + new Date().getMonth() + EXCEL_EXTENSION);
  }
}