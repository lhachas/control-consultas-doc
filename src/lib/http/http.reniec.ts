import { Http } from './http';
import { URL } from '../comun/constantes';

export class HttpReniec extends Http {
    constructor() {
        super(URL.RENIEC.Base)
    }
}
