import cheerio from 'cheerio';
import { Departamento, Direccion, Entidad, Contribuyente } from '../modelos';
import { RContribuyente } from '../intercambio';

export class Utils {
    /**
     *
     * @param string dato
     * @return RazonSocial
     *
     */
    public getRazonSocial(dato: string): Entidad {
        const entidad = new Entidad();
        if(dato !== '') {
            const data: string[] = dato.split('-').map((dato: string) => dato.trim());
            let razonSocial: string;
            if(data.length === 3) {
                razonSocial = `${data[1]} - ${data[2]}`;
            } else {
                razonSocial = data[1];
            }
            entidad.Ruc = data[0];
            entidad.RazonSocial = razonSocial;
        }
        return entidad;
    }

    /**
     *
     * @param string departamento
     * @return Departamento
     *
     */
    public getDepartamento(departamento: string): Departamento {
        const _departamento = new Departamento();
        switch(departamento.toUpperCase()){
            case 'DIOS':
                _departamento.Departamento = 'MADRE DE DIOS';
                _departamento.Cantidad = 3;
            break;
            case 'MARTIN':
                _departamento.Departamento = 'SAN MARTIN';
                _departamento.Cantidad = 2;
            break;
            case 'LIBERTAD':
                _departamento.Departamento = 'LA LIBERTAD';
                _departamento.Cantidad = 2;
            break;
            default:
                _departamento.Departamento = departamento;
                _departamento.Cantidad = 1;
            break;
        }
        return _departamento;
    }

    /**
     *
     * @param string direccionCompleta
     * @return Direccion
     *
     */
    public getDireccion(direccionCompleta: string): Direccion {
        const direccion = new Direccion();
        if(direccionCompleta !== '') {
            let _direccion: string[] = direccionCompleta.split('-').map((dato: string) => dato.trim());
            let _direccionCompleta: string[] = direccionCompleta.split('-').map((dato: string) => dato.trim());
            let _ultimoElemento: string;
            let _docimilio: string;
            let _splitDomicilio: string[]
            if (_direccionCompleta.length !== 3){
                _direccionCompleta.splice(2);
                _docimilio = _direccionCompleta.join(' ');
               _splitDomicilio = _docimilio.split(' ');
                _ultimoElemento = _splitDomicilio[_splitDomicilio.length -1];
            }else{
                _docimilio = _direccionCompleta[_direccionCompleta.length - 3];
                _splitDomicilio = _docimilio.split(' ');
                _ultimoElemento = _splitDomicilio[_splitDomicilio.length-1];
            }
            let { Cantidad, Departamento } = this.getDepartamento(_ultimoElemento);
            _splitDomicilio.splice(-1*Cantidad);
            direccion.Departamento = Departamento;
            direccion.Provincia = _direccion[_direccion.length - 1];
            direccion.Distrito = _direccion[_direccion.length - 2]
            direccion.Domicilio = _splitDomicilio.join(' ')
        }
        return direccion;
    }

    /**
     *
     * @param string pagina
     * @return Dictionary<string,any>
     *
     */
    public getContribuyente(pagina: string): RContribuyente {
        const respuesta = new RContribuyente();
        const $ = cheerio.load(pagina);
        const table = $('.form-table').eq(2).find('tbody');
        const html = table.first().children("tr").find("td[class=bg]").html();
        if(!html){
            respuesta.Exito = false;
            respuesta.MensajeError = $('.form-table').eq(1).children('tbody').find('tr .bg').text();
            return respuesta;
        }
        table.find('tr .bg').each((_i, elem) => {
            let value: string[] = $(elem).text().split('\n').map<string>((elemento: any) => {
                                        if(elemento.trim() !== '')
                                            return elemento.replace(/[ \n\t]+/g, " ").trim()
                                    }).filter((elemento: any) => {
                                        return elemento !== undefined
                                    });
            let prop: string         = $(elem).prev().text().replace(/[ :\n\t]+/g, " ").trim();
            let info: any = value.length <=1  ? value.join() : value;
            respuesta.ContribuyenteSunat.setValue(prop, info);
        });
        respuesta.Exito = true;
        return respuesta;
    }
}
