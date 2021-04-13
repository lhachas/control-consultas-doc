import { Contribuyente, Direccion, Entidad } from '../modelos';
import { HtmlParser } from './html-parser';
import ubigeos from '../data/ubigeos.json';

export class SunatParser 
{
    public htmlParser: HtmlParser;

    constructor()
    {
        this.htmlParser = new HtmlParser();
    }

    /**
     * @description
     * Get Overrid Departaments
     * @returns {any}
     */
    private get overridDeps(): any
    {
        return {
            'DIOS': 'MADRE DE DIOS',
            'MARTIN': 'SAN MARTIN',
            'LIBERTAD': 'LA LIBERTAD',
            'CALLAO': 'PROV. CONST. DEL CALLAO',
        }
    }
    
    /**
     * @description
     * Parse Html And Return Contribuyente
     * @param {string} html 
     * @returns {Contribuyente}
     */
    public parse(html: string): Contribuyente
    {
        if (!html)
        {
            return null;
        }

        const dictionary = this.htmlParser.parse(html);

        if (!dictionary)
        {
            return null;
        }

        return this.getContribuyente(dictionary);
    }
    
    /**
     * @description
     * Get Info Contribuyente Sunat
     * @param {any[]} dictionary 
     * @returns {Contribuyente}
     */
    private getContribuyente(dictionary: any[]): Contribuyente
    {
        const contribuyente = new Contribuyente();
        const { ruc, razonSocial } = this.getRazonSocial(dictionary['Número de RUC'] || dictionary['RUC']);
        const { direccion, departamento, provincia, distrito } = this.getDirection(dictionary['Dirección del Domicilio Fiscal'] || dictionary['Domicilio Fiscal']);
        const { codigo } = this.getUbigeo(departamento, provincia, distrito);
        contribuyente.ruc = ruc || '';
        contribuyente.razonSocial = razonSocial || '';
        contribuyente.nombreComercial = dictionary['Nombre Comercial'] || '';
        contribuyente.tipo = dictionary['Tipo Contribuyente'] || '';
        contribuyente.estado = dictionary['Estado del Contribuyente']  || dictionary['Estado'];
        contribuyente.condicion = dictionary['Condición del Contribuyente'] || dictionary['Condición'];
        contribuyente.direccion = direccion || '';
        contribuyente.departamento = departamento || '';
        contribuyente.provincia = provincia || '';
        contribuyente.distrito = distrito || '';
        contribuyente.ubigeo = codigo || '';
        contribuyente.fechaInscripcion = dictionary['Fecha de Inscripción'] || '';
        contribuyente.fechaBaja = dictionary['Fecha de Baja'] || '';
        contribuyente.profesionUOficio = dictionary['Profesión u Oficio'] || '';
        contribuyente.sistemaContabilidad = dictionary['Sistema de Contabilidad'] || '';
        contribuyente.actividadComercioExterior = dictionary['Actividad de Comercio Exterior'] || '';
        contribuyente.actividadesEconomicas = dictionary['Actividad(es) Económica(s)'] || [];
        contribuyente.sistemaEmisionComprobante = dictionary['Sistema de Emisión de Comprobante'] || '';
        contribuyente.sistemaEmisionElectronica = dictionary['Sistema de Emision Electronica'] || dictionary['Sistema de Emisión Electrónica'];
        contribuyente.fechaEmisorElectronico = dictionary['Emisor electrónico desde'] || '';
        contribuyente.comprobantesPago = dictionary['Comprobantes de Pago c/aut. de impresión (F. 806 u 816)'] || '';
        contribuyente.comprobantesPagoElectronico = dictionary['Comprobantes Electrónicos'] || '';
        contribuyente.fechaAfiliadoPLE = dictionary['Afiliado al PLE desde'] || '';
        contribuyente.padrones = dictionary['Padrones'] || [];
        contribuyente.telefonos = dictionary['Teléfono(s)'] || [];
        return contribuyente;
    }

        /**
     *
     * @param {string} str
     * @return {Entidad}
     *
     */
    public getRazonSocial(str: string): Entidad 
    {
        const entidad = new Entidad();
        const pos = str.trim().indexOf('-');
        entidad.ruc = str.substring(0, pos).trim();
        entidad.razonSocial = str.substring(pos+1).trim();
        return entidad;
    }

    /**
     * @description
     * Get Direction Of Contribuyente
     * @param {string} str 
     * @returns {Direccion}
     */
    private getDirection(str: string): Direccion
    {
        const direccion = new Direccion();
        let items = str.split('-').filter(item => item && item.trim() !=='');

        if (3 !== items.length)
        {
            direccion.direccion = str.replace(/[\s+]/, ' ');
            return direccion;
        }

        let pieces = items[0].trim().split(' ');
        let departament = this.getDepartament(pieces[pieces.length-1]);
        direccion.departamento = departament;
        direccion.provincia = items[1].trim();
        direccion.distrito = items[2].trim();
        let removeLength = departament.split(' ').length;
        let domicilio = pieces.slice(0, -1 * removeLength);
        direccion.direccion = domicilio.join(' ').trimRight();
        return direccion;
    }

    /**
     * @description
     * Get Departament
     * @param {string} departament
     * @returns {string}
     */
    private getDepartament(departament: string): string
    {
        departament = departament.toUpperCase();
        if (this.overridDeps[departament])
        {
            departament = this.overridDeps[departament];
        }
        return departament;
    }

    /**
     * @description
     * Get Ubigeo by Departament
     * Provicia and Distrito
     * @param {string} departament
     * @param {string} province 
     * @param {string} district
     * @returns {string}
     */
    public getUbigeo(departament: string, province: string, district: string): any
    {
        if (!departament || departament === '') return '';
        if (!province || province === '') return '';
        if (!district || district === '') return '';

        departament = departament.toUpperCase();
        province = province.toUpperCase();
        district = district.toUpperCase();

        const allUbigeos = ubigeos;

        const ubigeo = allUbigeos.find(ubigeo => {
            return departament.includes(ubigeo.departamento) &&
                province.includes(ubigeo.provincia) &&
                district.includes(ubigeo.distrito)
        });

        return ubigeo || '';
    }
}
