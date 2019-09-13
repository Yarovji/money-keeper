import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Bill } from '../models/bill.model';
import { BaseApi } from '../../../shared/core/base-api';


@Injectable()
export class BillService extends BaseApi {

    constructor(public http: HttpClient) {
        super(http);
    }

    apiKey = '3f155bc04e056b48e0fd0c39a07c4101';

    addBill(bill: Bill): Observable<Bill> {
        return this.post('/bill', bill);
    }

    getBill(user_id: number): Observable<Bill> {
        return this.get(`/bill?user_id=${user_id}`);
    }

    updateBill(bill: Bill): Observable<Bill> {
        return this.put(`/bill/${bill.id}`, bill);
    }

    getCurretncy(): Observable<any> {
        return this.http.get(`http://data.fixer.io/api/latest?access_key=${this.apiKey}&symbols=UAH,USD,EUR`);
    }
}
