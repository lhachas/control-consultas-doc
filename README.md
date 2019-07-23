# Control - Consultas Documentos - Sunat - Reniec 

_Consultas de Nro. de documentos a las diferentes entidades públicas del estado del Perú **(Sunat - Reniec)**_
 
 ## Comenzando 🚀

 ### Requerimientos 📋

 - NodeJS 10.16 
 - TypeScript 3.4 o Superior

### Instalación 🔧
_Para instalar clona este **Repositorio** ó directamente desde el gestor de paquetes de NodeJS **(NPM)**_

### Clonar 🔧
```
git clone https://github.com/ZMALIM/control.git
cd control-consultas-doc
npm install
npm run start
```

### Instalar con NPM 🔧
```
npm install --save control-consultas-doc
```
_**control-consultas-doc** se define como una dependencia._

## Pruebas ⚙️

### Uso - Funcionamiento 🔩
Importamos el modulo **control-consultas-doc** en la tipica importacion en ES6 - ES7 (Typecript - JavaScript)
``` ts
import { Sunat, Contribuyente } from 'control-consultas-doc';
```

### Consulta de RUC ⌨️
Para realizar la consulta del un numero de **RUC** hacemos uso del metodo **consultaRuc** lo cual esto nos devolvera una promesa de tipo **Contribuyente**
``` ts
const Sunat = new Sunat();
sunat.consultaRuc('12345678912')
    .then(contribuyente: Contribuyente => {
        console.log(contribuyente)
    })
    .catch(error => {
        console.log(error)
    })
```
### Async/Await
Tambien podemos hacer uso del **Async/Await**, La finalidad de los operadores async y await es simplificar aun más la forma en que trabajamos con las promesas.
``` ts
class Consulta {
    async Ruc(ruc: string): Promise<Contribuyente> {
        const sunat = new Sunat();
        return await sunat.consultaRuc(ruc);
    }
}
```

**Respuesta**

contribuyente

```json
{
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
    SistemaEmisionElectr: string[];
    FechaEmisorElectronico: string;
    Cpe: string[];
    FechaAfiliadoPLE: string;
    Padrones: string[];
}
```
## Construido con 🛠️

* [Visual Studio Code](https://code.visualstudio.com/) - Editor de codigo preferido.
* [request-promise](https://github.com/request/request-promise#readme) - El cliente de solicitud HTTP.
* [cheeriojs](https://github.com/cheeriojs/cheerio) - Implementación rápida, flexible y eficiente del núcleo jQuery diseñado específicamente para el servidor.
* [typescript-collections](https://github.com/basarat/typescript-collections) - Un conjunto genérico de colecciones para usar con TypeScript;

## Apoyo 🎁
**control-consultas-doc** es un proyecto de código abierto, construido con el lenguaje de programación **TypeScript**, aún esta en face de prueba, cualquier tipo de apoyo es bienvenido.

* Comenta a otros sobre este proyecto 📢.
* Comenta sobres las mejoras que encuentras 🤓.

## Autores ✒️
* [LeonelHS](https://www.facebook.com/Leonel.Hacha.Salazar) - Cuenta de **Facebook** Cualquier duda o critica.
