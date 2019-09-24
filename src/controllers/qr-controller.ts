import { Request, Response } from 'express';
import { isAuthenticated, isInsideChat, retrieveQR } from '../sullax/controllers/auth';
import {
    injectApi,
    initBrowser,
    getWhatsappPages, getBrow,
} from '../sullax/controllers/browser';
import { Whatsapp } from '../sullax/api/whatsapp';
import {puppeteerConfig} from "../sullax/config/puppeteer.config";

//const Task = mongoose.model('Task', TaskSchema);
const sulla = require('../sullax');
let wssocket = null;
export class QrController{
    public  async crearall() {
        var browser;
        try {

            // console.log('Iniciando Ws');
            if (wssocket == null){
                // console.log('vacio');
                browser = await initBrowser();

            }else{
                // console.log('llenos');
                browser = await getBrow(wssocket);
            }

            wssocket = browser.wsEndpoint();
            //     console.log('Iniciando Ws');
            // console.log('Obtener clientes');
            // console.log('Buscando');
            const wPages = await getWhatsappPages(browser);

            //const wPages = await browser.pages();
            // console.log('pages ' +wPages);
            let waPage = wPages;
            await waPage.setUserAgent(
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36'
            );
            await waPage.goto(puppeteerConfig.whatsappUrl);
            // console.log('Revisando autenticador');
            const authenticated = await isAuthenticated(waPage);
            // console.log('Resivado => '+authenticated);
            if (authenticated) {

            } else {
                var qr = await retrieveQR(waPage);

                //  console.log('ob qr =>'+qr);

                // Wait til inside chat
                await isInsideChat(waPage).toPromise();

            }
            // waPage = await injectApi(waPage);
            // console.log('wapage => '+waPage);

        }catch (e) {

        }
        return true;
    }
    public async getqr(req: Request, res: Response) {
        var browser;
        try {

        // console.log('Iniciando Ws');
            if (wssocket == null){
                // console.log('vacio');
                 browser = await initBrowser();

            }else{
                // console.log('llenos');
                 browser = await getBrow(wssocket);
            }

            wssocket = browser.wsEndpoint();
        //     console.log('Iniciando Ws');
        // console.log('Obtener clientes');
        // console.log('Buscando');
        const wPages = await getWhatsappPages(browser);

        //const wPages = await browser.pages();
        // console.log('pages ' +wPages);
        let waPage = wPages;
        await waPage.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3871.2 Safari/537.36'
        );
        await waPage.goto(puppeteerConfig.whatsappUrl);
        // console.log('Revisando autenticador');
        const authenticated = await isAuthenticated(waPage);
        // console.log('Resivado => '+authenticated);
        if (authenticated) {
            res.status(200).send({
                message: 'Usuario Autenticado',
                qr:'',
                wssocket: browser.wsEndpoint()
            });
        } else {
                var qr = await retrieveQR(waPage);

          //  console.log('ob qr =>'+qr);
            res.status(200).send({
                qr:qr,
                wssocket: browser.wsEndpoint(),
                message:"No Autenticado"
            });
            // Wait til inside chat
            await isInsideChat(waPage).toPromise();

        }
        // waPage = await injectApi(waPage);
        // console.log('wapage => '+waPage);

        }catch (e) {
            // if (e.hasError) {
            //     res.status(500).send({
            //         qr: '',
            //         wssocket: '',
            //         message: "Error"
            //     });
            // }
            res.end();
        }
        //const Wape =new Whatsapp(waPage);
       // await Wape.sendText("593989219681@c.us", 'Prueba');
    }
    public async getclients(req: Request, res: Response) {
        console.log('Obtener clientes');
        let browser = await initBrowser();
        console.log('Buscando');
        const wPages = await getWhatsappPages(browser);
        console.log('pages ' +wPages.length);
        res.status(200).send({
            message: wPages.length
        });
  }
  public async sendmess(req: Request, res: Response) {
var wsss;
      try {
          if (req.body.wssocket == ""){
              wsss = wssocket;
          }else{
              wsss = req.body.wssocket;
          }
          let browser = await getBrow(wsss);

            // console.log('Iniciando Ws');
            // console.log('Obtener clientes');
            // console.log('Buscando');
            const wPages = await browser.pages();
          //const wPages = await browser.pages();
          //   console.log('pages ' +wPages[0]);
            let waPage = wPages[0];
            // console.log(waPage.url());
            await waPage.setUserAgent(
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36'
            );
            await waPage.goto(puppeteerConfig.whatsappUrl+'/send?phone='+req.params.chatid+'&text=');
            //console.log(waPage.url());
          //  console.log('Revisando autenticador');
      const authenticated = await isAuthenticated(waPage);
      //console.log('Resivado => '+authenticated);
      if (authenticated) {
          waPage = await injectApi(waPage);
          //console.log('wapage => '+waPage);
          const Wape =new Whatsapp(waPage);
         // console.log(req.params.chatid+"@c.us");
          //console.log(req.body.message);
          await Wape.sendText(req.params.chatid+"@c.us", req.body.message);
          res.status(200).send({
              message: 'Enviado'
          });
         //browser.close();
         // waPage = null;
      } else {

          //  console.log('ob qr =>'+qr);
          res.status(200).send({
              message: 'Nesecita Autenticar'
          });
          browser.close();
          // Wait til inside chat
          //browser.close();

      }
        }catch (e) {
            console.log('Error'+e);
            res.status(500).send({
                message: 'Error'
            });

        }

  }

}

