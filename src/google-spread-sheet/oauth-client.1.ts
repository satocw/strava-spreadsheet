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

export class OAuthClient {
  oauth2Client: any;
  constructor() {
    this.initialize();
  }

  private initialize() {
    const { client_id, client_secret, redirect_uris } = this.readSecretFile(
      __dirname,
      '../../.credentials',
      './gss/client_secret.json'
    );
    console.log({ client_id, client_secret });

    this.oauth2Client = this.createOAuth2Client(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    this.getNewToken();
  }

  private readSecretFile(
    ...paths: string[]
  ): { client_id: string; client_secret: string; redirect_uris: string[] } {
    const content = fs.readFileSync(path.resolve(...paths));
    if (content) {
      return JSON.parse(content + '')['web'];
    }
    console.log('Error loading client secret file');
    throw new Error('Error loading client secret file');
  }

  private createOAuth2Client(clientId, clientSecret, redirectUrl) {
    const auth = new googleAuth();
    const client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
    const token = this.readTokenFile(TOKEN_PATH);
    if (token) {
      client.credentials = token;
      return client;
    } else {
      return this.getNewToken();
    }
  }

  private readTokenFile(path: string) {
    const content = fs.readFileSync(path);
    if (content) {
      return JSON.parse(content + '');
    }
  }

  private getNewToken(): string {
    if (!this.oauth2Client) {
      throw new Error('oauth2 Client is not initialized');
    }
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    console.log(authUrl);
    return authUrl;
  }
}
