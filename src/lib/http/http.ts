import { defaults, RequestPromiseAPI } from 'request-promise';
import { HttpResponse } from './http.response';

export class Http extends HttpResponse {
    public readonly http: RequestPromiseAPI;

    constructor(baseUrl: string) {
        super();
        this.http = defaults({
            baseUrl,
            jar: true,
            gzip: true,
            timeout: 10000,
            encoding: 'latin1',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
            }
        });
        this.http.debug = true;
    }
}
