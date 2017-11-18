import * as fs from 'fs';
import * as path from 'path';
import * as Rx from 'rxjs';

export function loadFiles(dir: string, extension: string): Rx.Observable<string> {
    const dataDir = path.resolve(__dirname, "..", "data", dir);
    const filenames = fs.readdirSync(dataDir).filter(filename => filename.indexOf(extension) > -1);
    const observable = Rx.Observable.create((observer: Rx.Observer<any>) => {
        filenames.forEach(filename => {
            fs.readFile(path.resolve(dataDir, filename), 'utf8', (err, data) => {
                if (err) {
                    Rx.Observable.throw(err);
                }
                observer.next(data);
            });
        });
    });
    return observable;
}

export function loadOneFile(path: string): Rx.Observable<string> {
    const observable = Rx.Observable.create((observer: Rx.Observer<any>) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    Rx.Observable.throw(err);
                }
                observer.next(data);
            });
        });
    return observable;
}