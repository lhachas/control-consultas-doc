export interface IContribuyente {
    Ruc: string;
    RazonSocial: string;
    Tipo: string;
    TipoDocumento: string;
    NombreComercial: string;
    FechaInscripcion: string;
    FechaInicioActividades: string;
    Estado: string;
    FechaBaja: string;
    Condicion: string;
    ProfesionUOficio: string;
    Direccion: string;
    Departamento: string;
    Provincia: string;
    Distrito: string;
    SistemaEmisionComprobante: string;
    ComercioExterior: string;
    SistemaContabilidad: string;
    ActividadesEconomicas: string[];
    ComprobantesPago: string[];
    SistemaEmisionElectr: string[],
    FechaEmisorElectronico: string;
    Cpe: string[];
    FechaAfiliadoPLE: string;
    Padrones: string[];
}
