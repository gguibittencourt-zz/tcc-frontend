import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Company } from '../_models';

@Injectable()
export class CompanyService {
    constructor(private http: HttpClient) { }

    get(id: number) {
        return this.http.get(`${config.apiUrl}/companies/` + id);
    }

    update(company: Company) {
        return this.http.put(`${config.apiUrl}/companies/` + company.idCompany, company);
    }

}
