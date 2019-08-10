import { defaults, Options, RequestPromiseAPI } from 'request-promise';
import { Tesseract } from 'tesseract.ts';
import Jimp from 'jimp';
import fs from 'fs';
import { RCaptcha, RHtml, RZip } from '../comun/intercambio';
import { IHttp } from '../comun/interfaces';
import { URL } from '../comun/constantes';
import { RequestResponse } from './request-response';

export class Http extends RequestResponse implements IHttp {
    private readonly http: RequestPromiseAPI;
    private readonly http2: RequestPromiseAPI;

	constructor () {
        super();
        this.http2 = defaults({
            timeout: 10000,
            encoding: 'latin1'
        });
		this.http = defaults({
            baseUrl: URL.SUNAT.Base,
            jar: true,
            gzip: true,
            timeout: 10000,
            encoding: 'latin1',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
            }
        });
        this.http.debug = true;
    }

    public async getImagenCaptcha(): Promise<string> {
        const image = await Jimp.read('http://www.sunat.gob.pe/cl-ti-itmrconsruc/captcha?accion=image&nmagic=0');
        image.normalize();
        image.color([
            { apply: 'blue', params: [50] },
            { apply: 'green', params: [50] },
            { apply: 'hue', params: [20] },
            { apply: 'mix', params: [50] },
            { apply: 'red', params: [50] },
            { apply: 'xor', params: [100] },
            { apply: 'shade', params: [22] },
        ]);
        image.sepia();
        image.rgba(false).greyscale().contrast(1).posterize(0);
        await image.writeAsync('./src/lib/temp/captcha.jpg');
        const captcha = await fs.readFileSync('./src/lib/temp/captcha.jpg');
        const { text } = await Tesseract.recognize(captcha, {
            lang: 'eng'
        });
        return text.replace(/\W/g, '').trim().toUpperCase();
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
                uri     : URL.SUNAT.Captcha,
                form    : {
                    accion : 'random'
                }
            }
            const captcha: any = await this.http(options);
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
     * @param ruc  [string]
     * @param captcha [string]
     * @return [RHtml]
     */
    async getHtml(ruc: string, captcha: string): Promise<RHtml> {
        const respuesta = new RHtml();
        try {
            const opciones: Options = {
                method: 'POST',
                uri: URL.SUNAT.Consulta,
                form: {
                    accion: 'consPorRuc',
                    nroRuc: ruc,
                    numRnd: captcha,
                    tipdoc: '1',
                },
                transform: this.requestResponse
            }
            return await this.http(opciones);
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

    /**
     *
     * @param rucs [string[]]
     * @returns retorna Html de la COnsulta Multiple
     */
    public async getMultipleRuc(rucs: string[]): Promise<RHtml> {
        try {
            const { Captcha } = await this.getCaptcha();
            const uri: string = URL.SUNAT.Multiple.concat('?', 'accion=consManual&textRuc=&numRnd=', Captcha, '&', rucs.map(ruc => {
                return `selRuc=${ruc}`;
            }).join('&'));
            const response: RHtml = await this.http.get(uri, {
                transform: this.requestResponse
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @param link [string] Enlace al archivo [.ZIP] en el servidor
     * @return [RZip]
     */
    public async getZip(link: string): Promise<RZip> {
        try {
            return await this.http2.get(link, {
                transform: this.zipResponse
            });
        } catch (error) {
            throw error;
        }
    }
}
