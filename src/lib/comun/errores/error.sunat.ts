import { load } from 'cheerio';

export class ErrorSunat {

    public getMensajeError(html: string): string {
        const $ = load(html);
        return $('body').find('.error').text();
    }

    public getMensajeConsultaRuc(html: string): string {
        const $ = load(html);
        return $('.form-table').eq(1).children('tbody').find('tr .bg').text();
    }
}
