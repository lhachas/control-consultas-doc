export class Comun {
    private origen?: string;
    private estado?: string;
    private mensajeError?: string;
    private exito?: boolean;

    get Origen(): string {
        return this.origen;
    }
    set Origen(origen: string) {
        this.origen = origen;
    }

    get Estado(): string {
        return this.estado;
    }
    set Estado(estado: string) {
        this.estado = estado;
    }

    get MensajeError(): string {
        return this.mensajeError;
    }
    set MensajeError(mensajeError: string) {
        this.mensajeError = mensajeError;
    }

    get Exito(): boolean {
        return this.exito;
    }
    set Exito(exito: boolean) {
        this.exito = exito;
    }
}
