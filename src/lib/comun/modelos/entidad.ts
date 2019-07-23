export class Entidad {
    public ruc!: string;
    public razonSocial!: string;

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
}
