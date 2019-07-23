import { Comun } from './comun';

export class RHtml extends Comun {
    private pagina?: string;

    get Pagina(): string {
        return this.pagina;
    }
    set Pagina(pagina: string) {
        this.pagina = pagina;
    }
}
