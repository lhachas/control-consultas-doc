import cheerio from 'cheerio';

export class HtmlParser 
{
    /**
     * @description
     * Keys From Table Sunat
     * @returns {string[]}
     */
    public get keys(): string[]
    {
        return [
            'RUC',
            'Tipo Contribuyente',
            'Nombre Comercial',
            'Fecha de Inscripción',
            'Estado',
            'Condición',
            'Domicilio Fiscal',
            'Actividad(es) Económica(s)',
            'Comprobantes de Pago c/aut. de impresión (F. 806 u 816)',
            'Sistema de Emisión Electrónica',
            'Afiliado al PLE desde',
            'Padrones',
            'Fecha Inicio de Actividades',
            'Teléfono(s)',
        ]
    }

    /**
     * @description
     * 
     * Parse Html
     * @param pagina 
     * @returns 
     */
    public parse(html: string): any
    {
        const $ = cheerio.load(html);
        const table = $('table')

        if (table.length === 0)
        {
            return false;
        }

        return this.getKeyAndValue(table, $);
    }

    /**
     * @description
     * Get Values And Key 
     * of Table Consult Sunat
     * @param {Cheerio} table 
     * @param {CheerioStatic} $ 
     * @returns {{ key: string }[]}
     */
    public getKeyAndValue(table: Cheerio, $: CheerioStatic): { key: string }[]
    {
        let arr = [];
        let dArr = [];
        table.find('tr td').each((_i, item) => {
            let keyValue = this.getKey(item, $);
            if (keyValue.trim() !== '')
            {
                if (!dArr.includes(keyValue))
                {
                    dArr = [...dArr, keyValue]
                    arr[keyValue] = this.getValue(item, $);
                }
            }
        });
        return arr;
    }

    /**
     * @description
     * Get Key Values
     * From Table Info
     * @param {CheerioElement} elem,
     * @param {CheerioStatic} $
     * @returns {string}
     */
    public getKey(elem: CheerioElement, $: CheerioStatic): string
    {
        let key = $(elem).prev().text();
        if (!key.includes(':'))
        {
            return '';
        }
        return key.replace(/[ :\n\t]+/g, ' ').trim()
    }

    /**
     * @description
     * Get Value From Node
     * Table Sunat 
     * @param {CheerioElement} elem 
     * @param {CheerioStatic} $ 
     * @returns {string[]}
     */
    public getValue(elem: CheerioElement, $: CheerioStatic): string | string[]
    {
        if (!elem) return '';

        if ($(elem).find('select').length > 0)
        {
            return  this.getValueFromOption(elem, $);
        }
        
        return this.getValueFromNode(elem, $);
    }

    /**
     * @description
     * Get Value From Node Table
     * @param {CheerioElement} elem 
     * @param {CheerioStatic} $ 
     * @returns {string}
     */
    public getValueFromNode(elem: CheerioElement, $: CheerioStatic): string
    {
        return $(elem).text().replace(/[ \n\t]+/g, " ").trim();
    }

    /**
     * @description
     * Get Values from option Select
     * @param {CheerioElement} elem 
     * @param {CheerioStatic} $ 
     * @returns {string[]} 
     */
    public getValueFromOption(elem: CheerioElement, $: CheerioStatic): string[]
    {
        let options = [];
        $(elem).find('select option').each((_e, item) => {
            options = [...options, $(item).text().replace(/[ \n\t]+/g, " ").trim()];
        });
        return options;
    }
}