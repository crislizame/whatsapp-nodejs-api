import {Request, Response} from "express";

import { TaskController } from "../controllers/task-controller";
import { QrController } from "../controllers/qr-controller";
import app from "../app";
import bodyParser = require("body-parser");

export class Routes {       
        
    public qrcontroller: QrController = new QrController();

    public routes(app): void {

        app.route('/')
        .get((req: Request, res: Response) => {            
            res.status(200).send({
                message: 'Acceso a petición GET'
            })
        });
        // task
        app.route('/getqr')
        // Endpoint para método GET
        .get(this.qrcontroller.getqr);

        app.route('/clients')
        // Endpoint para método GET
        .get(this.qrcontroller.getclients);

        app.post('/chats/:chatid/messages',bodyParser.json(),this.qrcontroller.sendmess);
        // // Rutas para tratar tareas existentes de forma individual
        // app.route('/task/:taskId')
        // // Endpoint del método GET para obtener una sola tarea
        // .get(this.taskController.getTaskWithID)
        // // Endpoint del método PUT
        // .put(this.taskController.updateTask)
        // // Endpoint del método DELETE
        // .delete(this.taskController.deleteTask)
    }
}
