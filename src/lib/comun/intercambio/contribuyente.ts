import { Comun } from './comun';
import { Contribuyente } from '../modelos';

export class RContribuyente extends Comun {
    private contribuyenteSunat?: any;
    private contribuyente?: Contribuyente;

    public get ContribuyenteSunat(): any {
        return this.contribuyenteSunat;
    }

    public set ContribuyenteSunat(contribuyenteSunat: any) {
        this.contribuyenteSunat = contribuyenteSunat;
    }

    public get Contribuyente(): Contribuyente {
        return this.contribuyente;
    }

    public set Contribuyente(contribuyente: Contribuyente) {
        this.contribuyente = contribuyente;
    }

    constructor() {
        super();
        this.Contribuyente = new Contribuyente();
    }
}
