export class Direccion {
    private departamento!: string;
    private provincia!: string;
    private distrito!: string;
    private domicilio!: string;

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

    public get Domicilio(): string
    {
        return this.domicilio;
    }

    public set Domicilio(domicilio: string)
    {
        this.domicilio = domicilio;
    }
}
