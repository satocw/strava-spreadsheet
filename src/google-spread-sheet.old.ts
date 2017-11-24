const GoogleSpreadsheet = require('google-spreadsheet');

export class SpreadSheet {

    private doc: any;
    private info: any;

    constructor(docId: string) {
        this.doc = new GoogleSpreadsheet(docId);
    }

    // doc
    public async setAuth() {
        const creds = require('../google-generated-creds.json');
        return new Promise((resolve, reject) => {
            if (!this.doc) {
                reject('No doc is to connect to...');
            }
            this.doc.useServiceAccountAuth(creds, resolve)
        });
    }

    // doc
    public getInfo(): Promise<any> {
        if (this.info) return Promise.resolve(this.info);
        return new Promise((resolve, reject) => {
            this.doc.getInfo((err: any, info: any) => {
                this.info = info;
                resolve(info);
            });
        });
    }

    // doc
    public getWorksheets() {
        return this.getInfo().then(info => {
            if (info && info.worksheets) {
                return info.worksheets;
            }
            return null;
        });
    }

    // doc
    public async getMonthlySheet(month: string|number) {
        const worksheets = await this.getWorksheets();
        if (!worksheets) throw new Error('Somehow could not get worksheets...');
        const title = month + '月';
        const targetMonth = (<any[]>worksheets).find(sheet => sheet.title === title);
        if (targetMonth) return targetMonth;
        return new Promise((resolve, reject) => {
            this.doc.addWorksheet({
                title: title
            }, function(err: any, sheet: any) {
                resolve(sheet);
            });
        });
    }

    // sheet
    public async setHeaders(sheet: any) {
        if (sheet && sheet.colCount < 25) {
            sheet = await this.resize(sheet);
        }
        sheet.setHeaderRow(["日","曜日","種類","強度","開始時刻","時間","距離","Asc","Dsc","場所","人","HR~100","100","110","120","130","140","150","160","170","180","190","190~"]);
        return sheet;
    }

    public resize(sheet: any) {
        return new Promise((resolve, reject) => {
            sheet.resize({rowCount: 50, colCount: 30});
            resolve(sheet);
        });
    }
}


