import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {
  constructor() { }
  
  private keys = [];
  private sheetNames;

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const workbook: XLSX.WorkBook = { 
      Sheets: {},
      SheetNames: [] 
    };

    var worksheet: XLSX.WorkSheet;
    
    for(var i = 0; i < json.length; i++){
      this.sheetNames = json[i][0].from;
      worksheet = XLSX.utils.json_to_sheet(json[i]);
      
      workbook.SheetNames.push(this.sheetNames);
      workbook.Sheets[this.sheetNames] = worksheet;
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});

    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}