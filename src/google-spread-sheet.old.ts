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

////////////////////////////////
//// v4

import * as fs from 'fs';
import * as path from 'path';
import * as request from "request-promise-native";
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

// Load client secrets from a local file.
export function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '../client_secret.json'), (err, content) => {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        reject('Error loading client secret file: ' + err);
      }
      // Authorize a client with the loaded credentials, then call the
      // Google Sheets API.
      const credentials = JSON.parse(content+'');
      resolve(authorize(JSON.parse(content+''), listMajors));
    });
  });
}

function _readFile(): Promise<{clientSecret: string, clientId: string, redirectUrl: string}> {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '../client_secret.json'), (err, content) => {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        reject('Error loading client secret file: ' + err);
      }
      // Authorize a client with the loaded credentials, then call the
      // Google Sheets API.
      const credentials = JSON.parse(content+'');
      resolve({
        clientSecret: credentials.web.client_secret,
        clientId: credentials.web.client_id,
        redirectUrl: credentials.web.redirect_uris[0]
      });
    });
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var redirectUrl = credentials.web.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, function(err, token) {
     if (err) {
       resolve(getNewToken(oauth2Client, callback));
     } else {
       oauth2Client.credentials = JSON.parse(token+'');
       resolve(callback(oauth2Client));
     }
   });
  });
}

export function getToken(code: string) {
  return new Promise((resolve, reject) => {
    _readFile().then(credentials => {
      const {clientSecret, clientId, redirectUrl} = credentials;
      const auth = new googleAuth();
      const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          return;
        }
        resolve(token);
        oauth2Client.credentials = token;
        storeToken(token);
        listMajors(oauth2Client);
      });
  
    });
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });

  // request.get(authUrl).then(res => console.log(res));

  return authUrl;


  // console.log('Authorize this app by visiting this url: ', authUrl);
  // var rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout
  // });
  // rl.question('Enter the code from that page here: ', function(code) {
  //   rl.close();
  //   oauth2Client.getToken(code, function(err, token) {
  //     if (err) {
  //       console.log('Error while trying to retrieve access token', err);
  //       return;
  //     }
  //     oauth2Client.credentials = token;
  //     storeToken(token);
  //     callback(oauth2Client);
  //   });
  // });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
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

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',		// 1Q5SPHgW5BwdX31FX_vfHNx7bG3jj9pNew5tLJVDdXR0
    range: 'Class Data!A2:E',
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
