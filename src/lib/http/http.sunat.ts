import { Options } from 'request-promise';
import request from 'request';
import progress from 'request-progress';
import Jimp from 'jimp';
import fs from 'fs';
import { Tesseract } from 'tesseract.ts';
import { RCaptcha, RHtml, RZip } from '../comun/intercambio';
import { IHttp } from '../comun/interfaces';
import { URL } from '../comun/constantes';
import { Http } from './http';

export class HttpSunat extends Http implements IHttp {
	constructor () {
        super(URL.SUNAT.Base);
    }

    /**
     * @description Obtiene y convierte el valor en formato [string] de la captcha [.JPG]
     * @return [string]
     */
    public async getCaptchaImagen(): Promise<string> {
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
     * @description Obtiene la [Captcha] para realizar la [Consulta] a [Sunat]
     * @return [Promise<RCaptcha>]
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
    async getRuc(ruc: string, captcha: string): Promise<RHtml> {
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
                transform: this.respuestaSunat
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
            return await this.getRuc(ruc, Captcha);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @descripcion Obtiene [HTML] de la consulta Rucs Mutiples
     * @param rucs [string[]]
     * @returns retorna [HTML] de la COnsulta Multiple
     */
    public async getMultipleRuc(rucs: string[]): Promise<RHtml> {
        try {
            const { Captcha } = await this.getCaptcha();
            const uri: string = URL.SUNAT.Multiple.concat('?', 'accion=consManual&textRuc=&numRnd=', Captcha, '&', rucs.map(ruc => {
                return `selRuc=${ruc}`;
            }).join('&'));
            const response: RHtml = await this.http.get(uri, {
                transform: this.respuestaSunat
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @description Obtiene archivo [.ZIP] desde el servidor
     * @param link [string] Enlace al archivo [.ZIP] en el servidor
     * @return [RZip]
     */
    public async getZip(link: string): Promise<RZip> {
        try {
            return await this.http.get(link, {
                transform: this.zipResponse,
                baseUrl: ''
            });
        } catch (error) {
            throw error;
        }
    }

    public async getPadronReducido(): Promise<RHtml> {
        try {
            // fs.readlinkSync();
            const opciones: Options = {
                method: 'POST',
                baseUrl: 'http://www.sunat.gob.pe',
                uri: 'descargaPRR/mrc137_padron_reducido.html',
                transform: this.respuestaSunat,
                timeout: 10000000,
            }
            return await progress(this.http(opciones))
                            .on('progress', (state) => {
                                console.log('progress', state);
                            })
                            .on('error',  (err) => {
                                console.log(err);

                            })
                            .on('end', () => {
                                console.log('fin');

                            })
            .pipe(fs.createWriteStream('padronSunat.zip'));;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @description Obtiene los [Representantes] de una entidad
     * @param ruc [string]
     * @return [Promise<Rhtml>]
     */
    public async getRepresentantesLegales(ruc: string): Promise<RHtml> {
        try {
            const options: Options = {
                method: 'POST',
                uri: URL.SUNAT.Consulta,
                form: {
                    accion: 'getRepLeg',
                    nroRuc: ruc,
                    desRuc: ''
                },
                transform: this.respuestaSunat
            }
            return await this.http(options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @description Obtiene Establecimientos del contribuyente
     * @param ruc [string]
     * @return [Promise<RHtml>]
     */
    public async getEstablecimientos(ruc: string): Promise<RHtml> {
        try {
            const options: Options = {
                method: 'POST',
                uri: URL.SUNAT.Consulta,
                form: {
                    accion: 'getLocAnex',
                    nroRuc: ruc,
                    desRuc: ''
                },
                transform: this.respuestaSunat
            }
            return await this.http(options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @description Obtiene el numero de trabajadores y sus correspodientes [DATOS]
     * @param ruc [string]
     * @return [Promise<RHtml>]
     */
    public async getTrabajadores(ruc: string): Promise<RHtml> {
        try {
            const options: Options = {
                method: 'POST',
                uri: URL.SUNAT.Consulta,
                form: {
                    accion: 'getCantTrab',
                    nroRuc: ruc,
                    desRuc: ''
                },
                transform: this.respuestaSunat
            }
            return await this.http(options);
        } catch (error) {
            throw error;
        }
    }
}
