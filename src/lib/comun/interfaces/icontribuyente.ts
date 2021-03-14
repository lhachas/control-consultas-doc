export interface IContribuyente 
{
    ruc: string;
    razonSocial: string;
    tipo: string;
    tipoDocumento: string;
    nombreComercial: string;
    fechaInscripcion: string;
    fechaInicioActividades: string;
    estado: string;
    fechaBaja: string;
    condicion: string;
    profesionUOficio: string;
    direccion: string;
    departamento: string;
    provincia: string;
    distrito: string;
    sistemaEmisionComprobante: string;
    actividadComercioExterior: string;
    sistemaContabilidad: string;
    actividadesEconomicas: string[];
    comprobantesPago: string[];
    sistemaEmisionElectronica: string[],
    fechaEmisorElectronico: string;
    cpe: string[];
    fechaAfiliadoPLE: string;
    padrones: string[];
}
