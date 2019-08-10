import { RespuestaHttp } from './respuesta-http';

export class RCaptcha extends RespuestaHttp {
    private captcha?: string;

    get Captcha(): string {
        return this.captcha;
    }
    set Captcha(captcha: string) {
        this.captcha = captcha;
    }
}
