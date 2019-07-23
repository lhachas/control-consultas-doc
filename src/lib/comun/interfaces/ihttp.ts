import { RCaptcha, RHtml } from '../intercambio';

export interface IHttp {
    getCaptcha(): Promise<RCaptcha>;
    getHtml(ruc: string, captcha: string): Promise<RHtml>;
    getInfo(ruc: string): Promise<RHtml>;
}
