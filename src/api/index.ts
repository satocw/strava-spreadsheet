import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { googleSpreadSheetService } from '../google-spread-sheet/google-spread-sheet.service';

export class IndexApi {
  constructor(router: Router) {
    const _this = this;

    router.use(_this.EnsureCredentials);
    router.get('/', _this.getRoot.bind(_this));
    // router.get('/gc/session', _this.getSession.bind(_this));
    // router.get('/gc/activities', _this.GetSummaryOfActivities.bind(_this));
    // router.get('/gc/activity/:activityId', _this.DownloadActivity.bind(_this));
    // // router.get('/gc/save/:activityId', this._saveActivity);

    // router.get('/ss/read', _this.ReadSpreadSheet.bind(_this));
    router.get('/ss/write', _this.WriteToSpreadSheet.bind(_this));
    router.get('/ss/post-auth', _this.GetPostAuth.bind(_this));

    // router.get('/tcx/load/:activityId', _this.LoadActivity.bind(_this));
  }

  private EnsureCredentials(req: any, res: any, next: any) {
    console.log('EnsureCredentials');
    next();
  }

  private getRoot(req: any, res: any) {
    res.send('/GET api ok');
  }

  // /** For testing */
  // private async getSession(req: Request, res: Response) {
  //     const cookieJar = await gc.auth();
  //     res.json(cookieJar);
  // }

  // private async GetSummaryOfActivities(req: Request, res: Response) {
  //     await gc.auth();
  //     const activities = await gc.getActivities();
  //     res.json(activities);
  // }

  // private async DownloadActivity(req: Request, res: Response) {
  //     await gc.auth();
  //     const id = req.params.activityId;
  //     const activity = await gc.getActivity(id);
  //     const result = await this.SaveActivityToFile(id, activity);
  //     res.send(result || 'Save activity succeeded');
  // }

  // private async SaveActivityToFile(filename: string, contents: string) {
  //     const filepath = path.join(__dirname, '../../data', filename) + '.tcx';
  //     const fileExists = fs.existsSync(filepath);
  //     if (fileExists) {
  //         return 'File already exists';
  //     }
  //     else {
  //         return fs.writeFileSync(filepath, contents, {encoding: 'utf8'});
  //     }
  // }

  // private async ReadSpreadSheet(req: Request, res: Response) {
  //     try {
  //         let result = await googleSpreadSheetService.getData();
  //         res.json(result);
  //         // if (result) {
  //         //     res.redirect(result);
  //         // }
  //         // else {
  //         //     res.send(result || 'Read SpreadSheet OK');
  //         // }
  //     }
  //     catch(err) {
  //         res.status(500).send(err);
  //     }
  // }

  private async WriteToSpreadSheet(req: Request, res: Response) {
    try {
      let result = await googleSpreadSheetService.writeData_Simple();
      if (result) {
        res.redirect(result);
      } else {
        res.send(result || 'Write SpreadSheet OK');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  private GetPostAuth(req: Request, res: Response) {
    console.log(req.query);
    const code = req.query.code;
    if (!code) {
      res.status(500).send('Unexpected request: Code is required');
      return;
    }
    // let token = googleSpreadSheetService.getAndStoreToken(code);
    res.send('Authorization finished now! Please try again.');
  }

  // private LoadActivity(req: Request, res: Response) {
  //     const id = req.params.activityId;
  //     const filepath = path.join(__dirname, '../../data', id) + '.tcx';
  //     tcx.loadOneFile(filepath).take(1).subscribe(str => {
  //         const data = activity.createFrom(str);
  //         res.json(data);
  //     }, (err) => {
  //         res.status(500).send(err);
  //     });
  // }

  // private async _saveActivity(req: Request, res: Response) {
  //     const id = req.params.activityId;
  //     const filepath = path.join(__dirname, '../../data', id) + '.tcx';
  //     fs.exists(filepath, (exists) => {
  //         if (exists) {
  //             res.send('file already exists');
  //         }
  //         else {
  //             // fs.mkdir(filepath, (err) => {
  //             //     if (err) {
  //             //         console.error(err);
  //             //         res.status(500).send(err);
  //             //     }
  //             //     else {
  //                     fs.writeFile(filepath, "aaaaa", (err) => {
  //                         if (err) {
  //                             console.error(err);
  //                             res.status(500).send(err);
  //                         }
  //                         else {
  //                             res.send("ok");
  //                         }
  //                     });
  //             //     }
  //             // });
  //         }
  //     });
  // }
}
