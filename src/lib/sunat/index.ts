import { HttpSunat } from '../http';
import { Contribuyente } from '../comun/modelos';
import { Utils, SunatParser } from '../comun/utils';
import { RHtml } from '../comun/intercambio';

export class Sunat 
{
    private client: HttpSunat;
    private utils: Utils;
    private sunarParser: SunatParser;

    constructor() 
    {
        this.client = new HttpSunat();
        this.utils = new Utils();
        this.sunarParser = new SunatParser();
    }

    public async consultaMultipleRuc(rucs: string[]): Promise<Contribuyente[]> 
    {
        try {
            const multiples: RHtml = await this.client.getMultipleRuc(rucs);
            if (!multiples.Exito) throw multiples;
            const link: string = this.utils.getLink(multiples.Pagina);
            if (link === '' || link === undefined) throw link;
            const rzip = await this.client.getZip(link);
            if (!rzip.Exito) throw rzip;
            const csv: string = await this.utils.parseZip(rzip.Zip);
            if (csv === '' || csv === undefined) throw csv;
            return this.utils.parseCSV(csv);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @description Consulta de ruc a Sunat
     * @param Ruc {string}
     * @return  [Contibuyente] devuelve datos del contribuyente
     * @enum [RucBaja] [20163106893]
     * @enum [RucSunat] [20131312955]
     * @enum [RucPN] [10467028028]
     */
    public async consultaRuc(ruc: string): Promise<Contribuyente>
    {
        try {
            const info = await this.client.getInfo(ruc);

            if(!info.Exito) 
            {
                throw info;
            }

            const contribuyente = this.sunarParser.parse(info.Pagina)

            if(!Contribuyente) 
            {
                throw 'Error Al Procesar Html.';
            }
 
            return contribuyente;
         
        } catch (error) {
            throw error;
        }
    }
}
