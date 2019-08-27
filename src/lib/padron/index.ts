import request from 'request';
import progress from 'request-progress';
import fs from 'fs';
import JSZip, { JSZipObject } from 'jszip';
import stream from 'stream';
import es from 'event-stream';
import readline from 'readline';
import LineByLineReader from 'line-by-line';


export class PadronReducido {
    async procesarPadron(): Promise<string> {
        progress(request({
            method : "GET",
            url : "http://www2.sunat.gob.pe/padron_reducido_ruc.zip",
            encoding: null // <- this one is important !
        }, async (error, response, body) => {
            if(error ||  response.statusCode !== 200) {
                // handle error
                console.log('Error al descargar.');

                return;
            }
            const zip = await JSZip.loadAsync(body);
            const fileTxt = await zip.file(/^.*\.txt$/)[0].nodeStream();
            const rl = readline.createInterface({
                input: fileTxt,
                crlfDelay: Infinity
            });

            rl.on('line', line => {
                console.log(line);
            });

            rl.on('close', () => {
                console.log('termianado');

            });
        }))
        .on('progress', (state) => {
            process.stdout.write('----'+ (Math.round(state.percent*100))+"%");
        })
        .on('error',  (err) => {
            console.log(err);

        })
        .on('end', () => {
            console.log('fin');

        });
        return '';
    }

    async leerTexto2(): Promise<string> {

        const lr = new LineByLineReader('./padron_reducido_ruc.txt');

        lr.on('error', (err) => {
            // 'err' contains error object
            console.log('Ocurrio un error al leer archivo: ', err);

        });

        lr.on('line', (line) => {
            // 'line' contains the current line without the trailing newline character.
            console.log(line);

        });

        lr.on('end', () => {
            // All lines are read, file is closed now.
            console.log('final al leer');
        });
        return '';
    }

    async leerTexto3(): Promise<string> {
        let totalLines = 0;
        const names = [];
        const s= fs
            .createReadStream('./padron_reducido_ruc.txt')
            .pipe(es.split())
            .pipe(
                es
                    .mapSync(line => {
                        totalLines++;
                        const name = line.split('|');
                        names.push(name);
                        console.log(names);

                    })
                    .on('error', (err) => {
                        console.log('Error mientras se lee el archivo.', err);
                    })
                    .on('end', () => {
                        console.log('Total lineas: ' + totalLines);
                    })
            );


        return '';
    }

    async leerTexto(): Promise<string> {
        const url = 'http://www2.sunat.gob.pe/padron_reducido_ruc.zip';
        const fileZip = fs.readFileSync('./padronSunat.zip');

        const zip = new JSZip();
        const data = await zip.loadAsync(fileZip);
        const dataZip: JSZipObject = data.file(/^.*\.txt$/)[0];
        const file = await dataZip.async('text');
        const fileTxt = await dataZip.nodeStream();

        const fileTxtPadron = fs.createReadStream('/.padron_reducido_ruc.txt');

        const read = new stream.Readable();
        read.push(file);
        read.push(null);

        const outStream =  new stream.Writable();

        const rl = readline.createInterface(fileTxt, outStream);

        let lineCount:number = 0;

        const names = [];

        rl.on('line', line => {
            // lineCount++;

            console.log(line);

            // const name = line.split('|')[1];
            // console.log(name);


        });

        rl.on('close', () => {
            console.log(lineCount);
        })
        return '';
    }
}
