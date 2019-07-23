import { IContribuyente } from '../interfaces';

export class Contribuyente implements IContribuyente {
    private ruc!: string;
    private razonSocial!: string;
    private tipo!: string;
    private tipoDocumento!: string;
    private nombreComercial!: string;
    private fechaInscripcion!: string;
    private fechaInicioActividades!: string;
    private estado!: string;
    private fechaBaja!: string;
    private condicion!: string;
    private profesionUOficio!: string;
    private direccion!: string;
    private departamento!: string;
    private provincia!: string;
    private distrito!: string;
    private sistemaEmisionComprobante!: string;
    private comercioExterior!: string;
    private sistemaContabilidad!: string;
    private actividadesEconomicas!: string[];
    private comprobantesPago!: string[];
    private sistemaEmisionElectr!: string[];
    private fechaEmisorElectronico!: string;
    private cpe!: string[];
    private fechaAfiliadoPLE!: string;
    private padrones!: string[];

    public get Ruc(): string
    {
        return this.ruc;
    }

    public set Ruc(ruc: string)
    {
        this.ruc = ruc;
    }

    public get RazonSocial(): string
    {
        return this.razonSocial;
    }

    public set RazonSocial(razonSocial: string)
    {
        this.razonSocial = razonSocial;
    }

    public get Tipo(): string
    {
        return this.tipo;
    }

    public set Tipo(tipo: string)
    {
        this.tipo = tipo;
    }

    public get TipoDocumento(): string
    {
        return this.tipoDocumento;
    }

    public set TipoDocumento(tipoDocumento: string)
    {
        this.tipoDocumento = tipoDocumento;
    }

    public get NombreComercial(): string
    {
        return this.nombreComercial;
    }

    public set NombreComercial(nombreComercial: string)
    {
        this.nombreComercial = nombreComercial;
    }

    public get FechaInscripcion(): string
    {
        return this.fechaInscripcion;
    }

    public set FechaInscripcion(fechaInscripcion: string)
    {
        this.fechaInscripcion = fechaInscripcion;
    }

    public get FechaInicioActividades(): string
    {
        return this.fechaInicioActividades;
    }

    public set FechaInicioActividades(fechaInicioActividades: string)
    {
        this.fechaInicioActividades = fechaInicioActividades;
    }

    public get Estado(): string
    {
        return this.estado;
    }

    public set Estado(estado: string)
    {
        this.estado = estado;
    }

    public get FechaBaja(): string
    {
        return this.fechaBaja;
    }

    public set FechaBaja(fechaBaja: string)
    {
        this.fechaBaja = fechaBaja;
    }

    public get Condicion(): string
    {
        return this.condicion;
    }

    public set Condicion(condicion: string)
    {
        this.condicion = condicion;
    }

    public get ProfesionUOficio(): string
    {
        return this.profesionUOficio;
    }

    public set ProfesionUOficio(profesionUOficio: string)
    {
        this.profesionUOficio = profesionUOficio;
    }

    public get Direccion(): string
    {
        return this.direccion;
    }

    public set Direccion(direccion: string)
    {
        this.direccion = direccion;
    }

    public get Departamento(): string
    {
        return this.departamento;
    }

    public set Departamento(departamento: string)
    {
        this.departamento = departamento;
    }

    public get Provincia(): string
    {
        return this.provincia;
    }

    public set Provincia(provincia: string)
    {
        this.provincia = provincia;
    }

    public get Distrito(): string
    {
        return this.distrito;
    }

    public set Distrito(distrito: string)
    {
        this.distrito = distrito;
    }

    public get SistemaEmisionComprobante(): string
    {
        return this.sistemaEmisionComprobante;
    }

    public set SistemaEmisionComprobante(sistemaEmisionComprobante: string)
    {
        this.sistemaEmisionComprobante = sistemaEmisionComprobante;
    }

    public get ComercioExterior(): string{
        return this.comercioExterior;
    }

    public set ComercioExterior(comercioExterior: string)
    {
        this.comercioExterior = comercioExterior;
    }

    public get SistemaContabilidad(): string
    {
        return this.sistemaContabilidad;
    }

    public set SistemaContabilidad(sistemaContabilidad: string)
    {
        this.sistemaContabilidad = sistemaContabilidad;
    }

    public get ActividadesEconomicas(): string[]
    {
        return this.actividadesEconomicas;
    }

    public set ActividadesEconomicas(actividadesEconomicas: string[])
    {
        this.actividadesEconomicas = actividadesEconomicas;
    }

    public get ComprobantesPago(): string[]
    {
        return this.comprobantesPago;
    }

    public set ComprobantesPago(comprobantesPago: string[])
    {
        this.comprobantesPago = comprobantesPago;
    }

    public get SistemaEmisionElectr(): string[]
    {
        return this.sistemaEmisionElectr;
    }

    public set SistemaEmisionElectr(sistemaEmisionElectr: string[])
    {
        this.sistemaEmisionElectr = sistemaEmisionElectr;
    }

    public get FechaEmisorElectronico(): string
    {
        return this.fechaEmisorElectronico;
    }

    public set FechaEmisorElectronico(fechaEmisorElectronico: string)
    {
        this.fechaEmisorElectronico = fechaEmisorElectronico;
    }

    public get Cpe(): string[]
    {
        return this.cpe;
    }

    public set Cpe(cpe: string[])
    {
        this.cpe = cpe;
    }

    public get FechaAfiliadoPLE(): string
    {
        return this.fechaAfiliadoPLE;
    }

    public set FechaAfiliadoPLE(fechaAfiliadoPLE: string)
    {
        this.fechaAfiliadoPLE = fechaAfiliadoPLE;
    }

    public get Padrones(): string[]
    {
        return this.padrones;
    }

    public set Padrones(padrones: string[])
    {
        this.padrones = padrones;
    }
}
