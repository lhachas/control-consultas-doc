import { IContribuyente } from '../interfaces';

export class Contribuyente implements IContribuyente 
{
    public ruc: string;
    public razonSocial: string;
    public tipo: string;
    public tipoDocumento: string;
    public nombreComercial: string;
    public fechaInscripcion: string;
    public fechaInicioActividades: string;
    public estado: string;
    public fechaBaja: string;
    public condicion: string;
    public profesionUOficio: string;
    public direccion: string;
    public departamento: string;
    public provincia: string;
    public distrito: string;
    public ubigeo: string;
    public sistemaEmisionComprobante: string;
    public sistemaContabilidad: string;
    public actividadComercioExterior: string;
    public actividadesEconomicas: string[];
    public comprobantesPago: string[];
    public comprobantesPagoElectronico: string[];
    public sistemaEmisionElectronica: string[];
    public fechaEmisorElectronico: string;
    public cpe: string[];
    public fechaAfiliadoPLE: string;
    public padrones: string[];
    public telefonos: string[];
    public fax: string;
    public principalCIIU: string;
    public secundario1CIIU: string;
    public secundario2CIIU: string;
    public afectoNuevoRUS: string;
    public buenContribuyente: string
    public agenteRetencion: string;
    public agentePercepcionVtaInt: string;
    public agentePercepcionComLiq: string;
}
