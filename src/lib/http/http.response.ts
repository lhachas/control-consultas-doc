import { Response } from 'request';
import HttpStatus from 'http-status-codes';
import cheerio from 'cheerio';
import { RHtml, RZip } from '../comun/intercambio';
import { ErrorSunat } from '../comun/errores/error.sunat';
import { ErrorReniec  } from '../comun/errores/error.reniec';

export class HttpResponse {

    /**
     *
     * @param body [any]
     * @param response [Response]
     * @return [RZip]
     */
    public zipResponse(body: any, response: Response): RZip {
        const rzip = new RZip();
        if (response.statusCode === HttpStatus.OK) {
            rzip.Exito = true;
            rzip.CodigoEstado = HttpStatus.OK;
            rzip.Zip = body;
        } else {
            rzip.Exito = false;
            rzip.CodigoEstado = HttpStatus.INTERNAL_SERVER_ERROR;
            rzip.MensajeError = 'Error en el servidor.'
        }
        return rzip;
    }

    /**
     * @param body [any]
     * @param response [Response]
     * @return [Rhtml]
     */
    respuestaSunat(body: any, response: Response): RHtml {
        const rhtml = new RHtml();
        const errorSunat = new ErrorSunat();
        if (response.statusCode === HttpStatus.OK) {
            const data = cheerio.load(body);
            const res = HttpStatus.ACCEPTED;
            switch (data('title').text()) 
            {
                case '.:: Pagina de Mensajes ::.': 
                    rhtml.Exito = false;
                    rhtml.CodigoEstado = HttpStatus.BAD_REQUEST;
                    rhtml.MensajeEstado = HttpStatus.getStatusText(HttpStatus.BAD_REQUEST);
                    rhtml.MensajeError = errorSunat.getMensajeError(data.html());
                break;
                case '.:: Pagina de Error ::.': 
                    rhtml.Exito = false;
                    rhtml.CodigoEstado = HttpStatus.FORBIDDEN;
                    rhtml.MensajeEstado = HttpStatus.getStatusText(HttpStatus.FORBIDDEN);
                    rhtml.MensajeError = errorSunat.getMensajeError(data.html());
                    break;
                case 'Request Rejected':
                    rhtml.Exito = false;
                    rhtml.CodigoEstado = HttpStatus.BAD_REQUEST;
                    rhtml.MensajeEstado = HttpStatus.getStatusText(HttpStatus.BAD_REQUEST);
                    rhtml.MensajeError = 'La URL solicitada fue rechazada. Consulte con su administrador.';
                    break;
                default:
                    rhtml.Exito = true;
                    rhtml.CodigoEstado = HttpStatus.OK;
                    rhtml.MensajeEstado = HttpStatus.getStatusText(HttpStatus.OK);
                    rhtml.Pagina = data.html();
                break;
            }
        } else {
            rhtml.Exito = false;
            rhtml.CodigoEstado = HttpStatus.INTERNAL_SERVER_ERROR;
            rhtml.MensajeEstado = HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR);
            rhtml.MensajeError = 'Error en el servidor.';
        }
        return rhtml;
    }
}
