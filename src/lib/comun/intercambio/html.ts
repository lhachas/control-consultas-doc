import { RespuestaHttp } from './respuesta-http';

export class RHtml extends RespuestaHttp {
    private pagina?: string;

    get Pagina(): string {
        return this.pagina;
    }
    set Pagina(pagina: string) {
        this.pagina = pagina;
    }
}
