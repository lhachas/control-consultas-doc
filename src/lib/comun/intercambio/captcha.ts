import { Comun } from './comun';

export class RCaptcha extends Comun {
    private captcha?: string;

    get Captcha(): string {
        return this.captcha;
    }
    set Captcha(captcha: string) {
        this.captcha = captcha;
    }
}
