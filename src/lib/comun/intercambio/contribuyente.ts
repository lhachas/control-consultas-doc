import { Dictionary } from 'typescript-collections';
import { Comun } from './comun';
import { Contribuyente } from '../modelos';

export class RContribuyente extends Comun {
    private contribuyenteSunat?: Dictionary<string, any>;
    private contribuyente?: Contribuyente;

    public get ContribuyenteSunat(): Dictionary<string, any> {
        return this.contribuyenteSunat;
    }

    public set ContribuyenteSunat(contribuyenteSunat: Dictionary<string, any>) {
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
        this.ContribuyenteSunat = new Dictionary<string, string|string[]>();
        this.Contribuyente = new Contribuyente();
    }
}
