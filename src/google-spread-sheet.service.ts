import * as fs from 'fs';
import * as path from 'path';
import * as request from "request-promise-native";
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var sheets = google.sheets('v4');
import { title as ssTitle, headerCell as ssHeaderCell, dateAndDays as ssDateAndDays, countDaysInMonth } from './google-spread-sheet.value';

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.activity-archiver.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.activity-archiver.json';

export class GoogleSpreadSheetService {

  private oauth2Client: any = null;
  private spreadSheetId = null;

  constructor() {
    this.setSpreadSheetId();
  }

  private async setAuth(): Promise<string|true> {
    if (this.oauth2Client && this.oauth2Client.credentials) {
      console.log('No need to setAuth. already authorized');
      return true;
    }
    const credentials = await this.readClientSecretFile();
    const clientSecret = credentials.web.client_secret;
    const clientId = credentials.web.client_id;
    const redirectUrl = credentials.web.redirect_uris[0];
    const auth = new googleAuth();
    this.oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
    const token = await this.readTokenFile();
    if (token) {
      this.oauth2Client.credentials = token;
      return true;
    }
    else {
      return this.getNewToken();
    }
  }

  public async getData() {
    if (!this.oauth2Client) {
      const result = await this.setAuth();
      if (typeof result === 'string') {
        return result;
      }
    }
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.get({
        auth: this.oauth2Client,
        spreadsheetId: this.spreadSheetId,
        includeGridData: true,
        ranges: [
          "Sheet1!A1:D2"
        ]
      }, (err, response) => {
        if (err) {
          console.log('The API returned an error: ' + err);
          reject(err);
        }
        resolve(response);
      });
    });
  }

  public async createFrames() {
    const year = 2017;  // TODO: パラメタ化する
    const month = 12;   // TODO: パラメタ化する
    if (!this.oauth2Client) {
      const result = await this.setAuth();
      if (typeof result === 'string') {
        return result;
      }
    }
    const daysInMonth = countDaysInMonth(year, month);
    sheets.spreadsheets.batchUpdate({
      auth: this.oauth2Client,
      spreadsheetId: this.spreadSheetId,
      resource: {
        requests: [
          // １行目と２行目
          {
            "updateCells": {
              "start": {
                  "sheetId": 0,
                  "rowIndex": 0,
                  "columnIndex": 0
              },
              "rows": [
                {
                  "values": [
                    ssTitle(`${month}月`)
                  ],
                },
                {
                  "values": [
                    ssHeaderCell("日"),
                    ssHeaderCell("曜日"),
                    ssHeaderCell("種類"),
                    ssHeaderCell("強度"),
                    ssHeaderCell("内容"),
                    ssHeaderCell("開始時刻"),
                    ssHeaderCell("時間"),
                    ssHeaderCell("距離"),
                    ssHeaderCell("Asc"),
                    ssHeaderCell("場所"),
                    ssHeaderCell("人"),
                    ssHeaderCell("HR~100"),
                    ssHeaderCell("100"),
                    ssHeaderCell("110"),
                    ssHeaderCell("120"),
                    ssHeaderCell("130"),
                    ssHeaderCell("140"),
                    ssHeaderCell("150"),
                    ssHeaderCell("160"),
                    ssHeaderCell("170"),
                    ssHeaderCell("180"),
                    ssHeaderCell("190"),
                    ssHeaderCell("190~"),
                    ssHeaderCell("メモ")
                  ]
                }
              ],
              "fields": "*"
            }
          },
          // 日と曜日
          {
            "updateCells": {
              "start": {
                "sheetId": 0,
                "rowIndex": 2,
                "columnIndex": 0
              },
              "rows": ssDateAndDays(year, month),
              "fields": "*"
            }
          },
          // 枠線
          {
            "updateBorders": {
              "range": {
                "sheetId": 0,
                "startRowIndex": 2,
                "endRowIndex": 2 + daysInMonth,
                "startColumnIndex": 0,
                "endColumnIndex": 24    // X列
              },
              // "top": {
              //   "style": "SOLID",
              //   "width": 1,
              //   "color": {
              //     "red": 0,
              //     "green": 0,
              //     "blue": 0,
              //     "alpha": 0
              //   }
              // },
              "bottom": {
                "style": "SOLID",
                "width": 1,
                "color": {
                  "red": 0,
                  "green": 0,
                  "blue": 0,
                  "alpha": 0
                }
              },
              "left": {
                "style": "SOLID",
                "width": 1,
                "color": {
                  "red": 0,
                  "green": 0,
                  "blue": 0,
                  "alpha": 0
                }
              },
              "right": {
                "style": "SOLID",
                "width": 1,
                "color": {
                  "red": 0,
                  "green": 0,
                  "blue": 0,
                  "alpha": 0
                }
              },
              "innerHorizontal": {
                "style": "SOLID",
                "width": 1,
                "color": {
                  "red": 0,
                  "green": 0,
                  "blue": 0,
                  "alpha": 0
                }        
              },
              "innerVertical": {
                "style": "SOLID",
                "width": 1,
                "color": {
                  "red": 0,
                  "green": 0,
                  "blue": 0,
                  "alpha": 0
                }   
              }
            }
          },
          // // オートリサイズ
          // {
          //   "autoResizeDimensions": {
          //     "dimensions": {
          //       "sheetId": 0,
          //       "dimension": "COLUMNS",
          //       "startIndex": 0,
          //       "endIndex": 2,
          //     }
          //   }
          // }
        ]
      }
    }, (err, response) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
    });
  }

  /** Not Currently Used */
  public async writeData_Simple() {
    if (!this.oauth2Client) {
      const result = await this.setAuth();
      if (typeof result === 'string') {
        return result;
      }
    }
    sheets.spreadsheets.values.batchUpdate({
      auth: this.oauth2Client,
      spreadsheetId: this.spreadSheetId,
      resource: {
        data: [
          {
            "range": "Sheet1!A2:X2",
            "values": [
              [
                "日","曜日","種類","強度","内容","開始時刻","時間","距離","Asc","場所","人","HR~100","100","110","120","130","140","150",
                "160","170","180","190","190~","メモ"
              ]
            ]
          },
          {
            "range": "Sheet1!A3:A32",
            "values": [
              ["1"],["2"],["3"],["4"],["5"],["6"]
            ]
          }
        ], 
        valueInputOption: "RAW"
      }
    }, (err, response) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
    });
  }

  /**
   * Print the names and majors of students in a sample spreadsheet:
   * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   */
  public async listMajors() {
    if (!this.oauth2Client) {
      const result = await this.setAuth();
      if (typeof result === 'string') {
        return result;
      }
    }
    sheets.spreadsheets.values.get({
      auth: this.oauth2Client,
      spreadsheetId: this.spreadSheetId,
      range: 'Sheet1!A2:E',
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var rows = response.values;
      if (rows.length == 0) {
        console.log('No data found.');
      } else {
        console.log('Name, Major:');
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          // Print columns A and E, which correspond to indices 0 and 4.
          console.log('%s, %s', row[0], row[4]);
        }
      }
    });
  }
  
  // Load client secrets from a local file.
  private readClientSecretFile(): Promise<{web:{client_secret: string, client_id: string, redirect_uris: string[]}}> {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname, '../client_secret.json'), (err, content) => {
        if (err) {
          console.log('Error loading client secret file: ' + err);
          reject('Error loading client secret file: ' + err);
        }
        // Authorize a client with the loaded credentials, then call the
        // Google Sheets API.
        resolve(JSON.parse(content+ ''));
      });
    });
  }

  private readTokenFile(): Promise<null|any> {
    return new Promise((resolve, reject) => {
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          resolve(null);
        }
        else {
          resolve(JSON.parse(token+''));
        }
      });
    });
  }

  private setSpreadSheetId() {
    fs.readFile(path.resolve(__dirname, '../google_spread_sheet.json'), (err, content) => {
      if (err) {
        console.log('Error loading google_spread_sheet.json file: ' + err);
        throw err;
      }
      const json = JSON.parse(content+ '');
      if (json && json.sheetId) {
        this.spreadSheetId = json.sheetId;
        return;
      }
      throw new Error('Error setting spreadsheet id');
    });
  }

  private getNewToken(): string {
    if (!this.oauth2Client) {
      throw new Error('oauth2 Client is not initialized');
    }
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    return authUrl;
  }

  public getAndStoreToken(code: string) {
    if (!this.oauth2Client) {
      throw new Error('oauth2 Client is not initialized');
    }
    return this.oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return err;
      }
      this.oauth2Client.credentials = token;
      this.storeToken(token);
    });
  }

  /**
   * Store token to disk be used in later program executions.
   *
   * @param {Object} token The token to store to disk.
   */
  private storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) {
        throw err;
      }
      console.log('Token stored to ' + TOKEN_PATH);
    });
  }

}

export const googleSpreadSheetService = new GoogleSpreadSheetService();
