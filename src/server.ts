import { SpreadSheet } from "./google-spread-sheet";
import * as fileLoader from './file-loader';
import * as activity from './activity';

class Server {

    private month = '';   // 対象とするtcxファイルの範囲。例；201709
    private docId = ''; // 書き込むスプレッドシートのID

    constructor() {
        this.prepare();
        this.loadFiles();
        // this.spreadsheet();
    }

    private prepare() {
        const args = process.argv;
        console.dir(args)
        args.forEach(arg => {
            if (arg.indexOf('--month') > -1) {
                 this.month = arg.split('=')[1];
            }
            if (arg.indexOf('--to') > -1) {
                this.docId = arg.split('=')[1];
            }    
        });

        if (!this.month || !this.docId) {
            throw new Error('Not enough arguments are passed!');
        }
    }

    private loadFiles() {
        fileLoader.loadFiles(this.month, '.tcx')
            .subscribe(data => {
                const act = activity.createFrom(data)
                console.log(act);
            });
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
