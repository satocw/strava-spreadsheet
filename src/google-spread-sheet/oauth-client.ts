import * as fs from 'fs';
import * as path from 'path';
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.strava-spreadsheet.json
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
  '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.strava-spreadsheet.json';

// console.log('token path: ', TOKEN_PATH);

export class OAuth2ClientFactory {
  public static create() {
    try {
      const { client_id, client_secret, redirect_uris } = this.readSecretFile(
        __dirname,
        '../../.credentials',
        './gss/client_secret.json'
      );

      const oauth2Client = this.createOAuth2Client(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      this.setToken(oauth2Client);
    } catch (e) {
      console.error(e);
    }
  }

  // Google API Consoleからclient_secret.jsonをダウンロードしておく。
  // ファイルが無い場合、手動でダウンロードするしかないので、その旨をエラーで伝える。
  private static readSecretFile(
    ...paths: string[]
  ): { client_id: string; client_secret: string; redirect_uris: string[] } {
    const _path = path.resolve(...paths);
    if (fs.existsSync(_path)) {
      const content = fs.readFileSync(path.resolve(...paths));
      if (content) {
        return JSON.parse(content + '')['web'];
      }
      throw new Error(
        '[OAuth2ClientFactory::readSecretFile] client_secret.json file is Empty.'
      );
    } else {
      throw new Error(
        '[OAuth2ClientFactory::readSecretFile] client_secret.json file was not found in: ' +
          _path
      );
    }
  }

  // あらかじめTokenをしている場合は、それを取得する。
  // 取得していなかったり、取得していても期限がきれている場合は、
  // App上で後ほど認証画面に遷移する。
  private static readTokenFile(path: string) {
    if (fs.existsSync(path)) {
      const content = fs.readFileSync(path);
      if (content) {
        return JSON.parse(content + '');
      }
      console.log('[OAuth2ClientFactory::readTokenFile] token file is Empty.');
      return false;
    } else {
      console.log(
        '[OAuth2ClientFactory::readTokenFile] token file was not found in: ' +
          path
      );
      return false;
    }
  }

  private static setToken(client) {
    const token = this.readTokenFile(TOKEN_PATH);
    if (token) {
      client.credentials = token;
      return true;
    }
    return false;
  }

  private static createOAuth2Client(clientId, clientSecret, redirectUrl) {
    const auth = new googleAuth();
    const client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
    return client;
  }

  private static getAuthUrl(client): string {
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    console.log(authUrl);
    return authUrl;
  }
}
