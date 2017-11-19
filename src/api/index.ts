import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as gc from "../garmin-connect.service";

export class IndexApi {

    constructor(router: Router) {
        const _this = this;
        router.get('/', _this.getRoot.bind(_this));
        router.get('/gc/session', _this.getSession.bind(_this));
        router.get('/gc/activities', _this.GetSummaryOfActivities.bind(_this));
        router.get('/gc/activity/:activityId', _this.DownloadActivity.bind(_this));

        // router.get('/gc/save/:activityId', this._saveActivity);
    }

    private getRoot(req: any, res: any) {
        res.send('/GET api ok');
    }

    /** For testing */
    private async getSession(req: Request, res: Response) {
        const cookieJar = await gc.auth();
        res.json(cookieJar);
    }

    private async GetSummaryOfActivities(req: Request, res: Response) {
        await gc.auth();
        const activities = await gc.getActivities();
        res.json(activities);
    }

    private async DownloadActivity(req: Request, res: Response) {
        await gc.auth();
        const id = req.params.activityId;
        const activity = await gc.getActivity(id);
        const result = await this.SaveActivityToFile(id, activity);
        res.send(result || 'Save activity succeeded');
    }

    private async SaveActivityToFile(filename: string, contents: string) {
        const filepath = path.join(__dirname, '../../data', filename) + '.tcx';
        const fileExists = fs.existsSync(filepath);
        if (fileExists) {
            return 'File already exists';
        }
        else {
            return fs.writeFileSync(filepath, contents, {encoding: 'utf8'});
        }
    }

    private async _saveActivity(req: Request, res: Response) {
        const id = req.params.activityId;
        const filepath = path.join(__dirname, '../../data', id) + '.tcx';
        fs.exists(filepath, (exists) => {
            if (exists) {
                res.send('file already exists');
            }
            else {
                // fs.mkdir(filepath, (err) => {
                //     if (err) {
                //         console.error(err);
                //         res.status(500).send(err);
                //     }
                //     else {
                        fs.writeFile(filepath, "aaaaa", (err) => {
                            if (err) {
                                console.error(err);
                                res.status(500).send(err);
                            }
                            else {
                                res.send("ok");
                            }
                        });
                //     }
                // });
            }
        });
    }
}