import { SpreadSheet } from "./google-spread-sheet";

class Server {

    private day = '';   // 対象とするtcxファイルの範囲。例；201709
    private docId = ''; // 書き込むスプレッドシートのID

    constructor() {
        this.prepare();
        this.loadFiles();
        this.spreadsheet();
    }

    private prepare() {
        const args = process.argv;
        console.dir(args)
        args.forEach(arg => {
            if (arg.indexOf('--day') > -1) {
                 this.day = arg.split('=')[1];
            }
            if (arg.indexOf('--to') > -1) {
                this.docId = arg.split('=')[1];
            }    
        });

        if (!this.day || !this.docId) {
            throw new Error('Not enough arguments are passed!');
        }
    }

    private loadFiles() {

    }

    private async spreadsheet() {
        const s = new SpreadSheet(this.docId);
        await s.setAuth();
        s.getMonthlySheet(9).then(sheet => {
            s.setHeaders(sheet);
        });
    }
}

const server = new Server();
