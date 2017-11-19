import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import * as http from 'http';

import { IndexApi } from "./api/index";

const PORT = 3000;

class Server {

    public app: express.Application;

    constructor() {
        this.app = express();

        this.config();

        this.api();
    }

    private api() {
        const apiRouter = express.Router();
        new IndexApi(apiRouter);
        this.app.use('/api', apiRouter);
    }

    private config() {
        this.app.set("port", PORT);

        this.app.use(express.static(path.join(__dirname, "public")));

        this.app.set("views", path.join(__dirname, "../views"));
        this.app.set("view engine", "pug");

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        this.app.set('json spaces', 2);
        
		//catch 404 and forward to error handler
		this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
			err.status = 404;
			next(err);
		});
    }

    public static start() {
        const server = new Server();
        const httpServer = http.createServer(server.app)
        httpServer.listen(PORT);
        httpServer.on("listening", () => { console.log('Server started...') });
    }
}

Server.start();