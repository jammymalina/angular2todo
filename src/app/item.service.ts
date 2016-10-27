import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { TodoItem } from './todo-item';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ItemService {

    private itemsURL = 'app/data.json';

    constructor(private http: Http) {}

    getItems(): Observable<TodoItem[]> {
        return this.http.get(this.itemsURL).map(this.extractData).catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || body.data || {};
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}
