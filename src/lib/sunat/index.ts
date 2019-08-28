import { HttpSunat } from '../http';
import { Contribuyente } from '../comun/modelos';
import { Utils } from '../comun/utils';
import { RHtml } from '../comun/intercambio';

export class Sunat {
    private client: HttpSunat;
    private utils: Utils;

    constructor() {
        this.client = new HttpSunat();
        this.utils = new Utils();
    }

    async consultaMultipleRuc(rucs: string[]): Promise<Contribuyente[]> {
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
    async consultaRuc(ruc: string): Promise<Contribuyente>{
        try {
            const info = await this.client.getInfo(ruc);
            if(!info.Exito) {
                throw info;
            }
            const { ContribuyenteSunat, Exito, MensajeError } = this.utils.getContribuyente(info.Pagina);
            if(!Exito) {
                throw MensajeError;
            }
            const {
                Departamento,
                Provincia,
                Distrito,
                Domicilio
            } = this.utils.getDireccion(ContribuyenteSunat.getValue('Dirección del Domicilio Fiscal'));
            const {
                Ruc,
                RazonSocial
            } = this.utils.getRazonSocial(ContribuyenteSunat.getValue('Número de RUC'));
            return {
                Ruc,
                RazonSocial,
                Tipo:  ContribuyenteSunat.getValue('Tipo Contribuyente'),
                TipoDocumento:  ContribuyenteSunat.getValue('Tipo de Documento') === undefined ? '-' : ContribuyenteSunat.getValue('Tipo de Documento').join(' '),
                NombreComercial: ContribuyenteSunat.getValue('Nombre Comercial'),
                FechaInscripcion: ContribuyenteSunat.getValue('Fecha de Inscripción'),
                FechaInicioActividades: ContribuyenteSunat.getValue('Fecha Inicio de Actividades'),
                Estado: ContribuyenteSunat.getValue('Estado del Contribuyente'),
                FechaBaja: ContribuyenteSunat.getValue('Fecha de Baja') === undefined ? '-' : ContribuyenteSunat.getValue('Fecha de Baja'),
                Condicion: ContribuyenteSunat.getValue('Condición del Contribuyente'),
                ProfesionUOficio: ContribuyenteSunat.getValue('Profesión u Oficio') === undefined ? '-' : ContribuyenteSunat.getValue('Profesión u Oficio'),
                Departamento,
                Provincia,
                Distrito,
                Direccion: Domicilio,
                SistemaEmisionComprobante: ContribuyenteSunat.getValue('Sistema de Emisión de Comprobante'),
                ComercioExterior: ContribuyenteSunat.getValue('Actividad de Comercio Exterior'),
                SistemaContabilidad: ContribuyenteSunat.getValue('Sistema de Contabilidad'),
                ActividadesEconomicas: ContribuyenteSunat.getValue('Actividad(es) Económica(s)'),
                ComprobantesPago: ContribuyenteSunat.getValue('Comprobantes de Pago c/aut. de impresión (F. 806 u 816)'),
                SistemaEmisionElectr: ContribuyenteSunat.getValue('Sistema de Emisión Electrónica'),
                FechaAfiliadoPLE: ContribuyenteSunat.getValue('Afiliado al PLE desde'),
                Padrones: ContribuyenteSunat.getValue('Padrones'),
            } as Contribuyente;
        } catch (error) {
            throw error;
        }
    }
}
