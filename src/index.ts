// export * from './lib/http';
// export * from './lib/sunat';
// export * from './lib/comun/modelos';

import { Sunat } from './lib/sunat';
import { Http } from './lib/http';

const sunat = new Sunat();
const http = new Http();

sunat.consultaMultipleRuc(['20131312955']).then(resp => {
    console.log(resp);
}).catch(e => {
    console.log(e);
});

// sunat.consultaRuc('20601587417')
//     .then(contribuyente => {
//         console.log(contribuyente);
//     })
//     .catch(e => {
//         console.log(e);
//     });


