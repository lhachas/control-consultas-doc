export class Departamento {
    private departamento!: string;
    private cantidad!: number;

    public get Departamento(): string
    {
        return this.departamento!;
    }

    public set Departamento(departamento: string)
    {
        this.departamento! = departamento!;
    }

    public get Cantidad(): number
    {
        return this.cantidad!;
    }

    public set Cantidad(cantidad: number)
    {
        this.cantidad! = cantidad!;
    }
}
