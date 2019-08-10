import { Comun } from './comun';
import HttpStatus from 'http-status-codes';

export class RespuestaHttp extends Comun {
    private codigoEstado: number;
    private mensajeEstado: string;

    get CodigoEstado(): number {
        return this.codigoEstado;
    }

    set CodigoEstado(codigoEstado: number) {
        this.codigoEstado = codigoEstado;
    }

    get MensajeEstado(): string {
        return this.mensajeEstado;
    }

    set MensajeEstado(mensajeEstado: string) {
        this.mensajeEstado = mensajeEstado;
    }
}
