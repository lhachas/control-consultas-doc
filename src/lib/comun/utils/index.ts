import cheerio from 'cheerio';
import JSZip, { JSZipObject } from 'jszip';
import { Departamento, Direccion, Entidad, Contribuyente } from '../modelos';
import { RContribuyente } from '../intercambio';
import { ErrorSunat } from '../errores/error.sunat';
import { ErrorReniec } from '../errores/error.reniec';

export class Utils {
    private readonly errorSunat: ErrorSunat;
    private readonly errorReniec: ErrorReniec;

    constructor() {
        this.errorSunat = new ErrorSunat();
        this.errorReniec = new ErrorReniec();
    }

    /**
     * @description Recupera el link de archivo [.Zip] devuelto por la [SUNAT]
     * @param html [string]
     * @return [string]
     */
    public getLink(html: string): string {
        try {
            const $ = cheerio.load(html);
            const link = $('td.bg>a').first().attr('href');
            return link;
        } catch (error) {
            throw error;
        }
    }

    public getLinkPadronReducido(html: string): string {
        try {
            const $ = cheerio.load(html);
            return $('.contentbody').find('div>a').first().attr('href')
        } catch (error) {
            throw error;
        }
    }

    /**
     * @description Obtiene los datos del archivo [.Zip]
     * @param archivoZip [string]
     * @return [Promise<string>]
     */
    public async parseZip(archivoZip: string): Promise<string> {
        try {
            const zip = new JSZip();
            const data =  await zip.loadAsync(archivoZip);
            const dataZip: JSZipObject =  data.file(/^.*\.txt$/)[0];
            return await dataZip.async('text');
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @param csv [string]
     * @return [Contribuyente[]]
     */
    public getCsv(csv: string): Contribuyente[] {
        const _csv = csv.replace(/\r/g, '');
        const data = _csv.split('\n').map(line => {
            return line.split('|');
        });
        const contribuyente = [
            'Ruc',
            'RazonSocial',
            'Tipo',
            'ProfesionUOficio',
            'NombreComercial',
            'Condicion',
            'Estado',
            'FechaInscripcion',
            'FechaInicioActividades',
            'Departamento',
            'Provincia',
            'Distrito',
            'Direccion',
            'Telefono',
            'Fax',
            'ComercioExterior',
            'PrincipalCIIU',
            'Secundario1CIIU',
            'Secundario2CIIU',
            'AfectoNuevoRUS',
            'BuenContribuyente',
            'AgenteRetencion',
            'AgentePercepcionVtaInt',
            'AgentePercepcionComLiq',
            ''
        ];
        const respuesta = [];
        data.splice(1).forEach(line => {
            if (line) {
                const r = {};
                if (line.length > 0) {
                    line.forEach((l, index) => {
                        if(l && l.length > 0) {
                            r[contribuyente[index]] = l.trim();
                        }
                    });
                    if (Object.keys(r).length > 0) {
                        respuesta.push(r)
                    }
                }
            }
        })
        return respuesta;
    }

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
            respuesta.MensajeError = this.errorSunat.getMensajeConsultaRuc(pagina);
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
