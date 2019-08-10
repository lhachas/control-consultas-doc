import { RespuestaHttp } from './respuesta-http';

export class RZip extends RespuestaHttp {
    private zip: string;

    get Zip(): string {
        return this.zip;
    }

    set Zip(zip: string) {
        this.zip = zip;
    }
}
