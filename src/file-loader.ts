import * as fs from 'fs';
import * as path from 'path';
import * as Rxjs from 'rxjs';

export function loadFiles(dir: string, extension: string): Rxjs.Observable<string> {
    const dataDir = path.resolve(__dirname, "..", "data", dir);
    const filenames = fs.readdirSync(dataDir).filter(filename => filename.indexOf(extension) > -1);
    const observable = Rxjs.Observable.create((observer: Rxjs.Observer<any>) => {
        filenames.forEach(filename => {
            fs.readFile(path.resolve(dataDir, filename), 'utf8', (err, data) => {
                if (err) {
                    Rxjs.Observable.throw(err);
                }
                observer.next(data);
            });
        });
    });
    return observable;
}