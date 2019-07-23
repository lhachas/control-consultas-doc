import { defaults, Options, RequestPromiseAPI } from 'request-promise';
import cheerio from 'cheerio';
import { RCaptcha, RHtml } from '../comun/intercambio';
import { IHttp } from '../comun/interfaces';
import { URL } from '../comun/constantes';

export class Http implements IHttp {
    private readonly client: RequestPromiseAPI;

	constructor () {
		this.client = defaults({
            jar: true,
            gzip: true,
            timeout: 10000,
            encoding: 'latin1',
            headers: {
                'accept': '*/*',
                'Content-Type': 'text/plain; charset=utf-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
            }
        });
        this.client.debug = true;
    }

    /**
     * @return Promise<RespuestaRequest>
     *
     */
    public async getCaptcha(): Promise<RCaptcha> {
        const respuesta = new RCaptcha();
        try {
            const options: Options = {
                method  : 'post',
                uri     : 'http://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/captcha',
                form    : {
                    accion : 'random'
                }
            }
            const captcha: any = await this.client(options);
            respuesta.Exito = true;
            respuesta.Captcha = captcha.toString();
        } catch (error) {
            respuesta.Exito = false;
            respuesta.Origen = 'captcha';
            respuesta.MensajeError = error.statusCode === undefined ? `${error.message} - ${error.name}` : `${error.statusCode} - ${error.name}`;
        }
        return respuesta;
    }

    /**
     * @param ruc  string
     * @param captcha string
     * @return RHtml
     *
     */
    async getHtml(ruc: string, captcha: string): Promise<RHtml> {
        const respuesta = new RHtml();
        try {
            const opciones: Options = {
                method: 'POST',
                uri: URL.consulta,
                form: {
                    accion: 'consPorRuc',
                    nroRuc: ruc,
                    numRnd: captcha
                },
                transform: (body: any) => {
                    return cheerio.load(body);
                }
            }
            const pagina: any = await this.client(opciones);
            respuesta.Exito = true;
            respuesta.Pagina = pagina.html();

        } catch (error) {
            respuesta.Exito = false;
            respuesta.Origen = 'getHtml';
            respuesta.MensajeError = error.statusCode === undefined ? error.message : `${error.statusCode} - ${error.name}`
        }
        return respuesta;
    }

    /**
     * @description Obtiene informacion del contribuyente
     * @param Ruc string
     * @return RHtml
     */
    public async getInfo(ruc: string): Promise<RHtml> {
        const respuesta = new RHtml();
        try {
            const { Captcha } = await this.getCaptcha();
            return await this.getHtml(ruc, Captcha);
        } catch (error) {
            throw error;
        }
    }
}
