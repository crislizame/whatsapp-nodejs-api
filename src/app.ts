    import * as express from "express";
    import * as bodyParser from "body-parser";
    import { Routes } from "./routes/routes";
    import * as mongoose from "mongoose";
    import { QrController } from "./controllers/qr-controller";

    class App {

        public app: express.Application;
        public routePrv: Routes = new Routes();
        public qrcontroller: QrController = new QrController();

        public mongoUrl: string = 'mongodb://todo:pwdTodo@db:27017/TODOdb';

        constructor() {
            this.app = express();
            this.config();
            this.routePrv.routes(this.app);
            this.qrcontroller.crearall();

            //this.mongoSetup();
        }

        private config(): void{
            // support application/json type post data
            this.app.use(bodyParser.json());
            //support application/x-www-form-urlencoded post data
            this.app.use(bodyParser.urlencoded({ extended: true  }));
        }

        private mongoSetup(): void{
            mongoose.Promise = global.Promise;
            mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
        }
    }

    export default new App().app;
