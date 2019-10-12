import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataSource} from '../_models';

@Injectable()
export class DataSourceService {
	constructor(private http: HttpClient) {
	}

	get(id: number) {
		return this.http.get(`${config.apiUrl}/data-sources/` + id);
	}

	list(idCompany: number) {
		return this.http.get(`${config.apiUrl}/data-sources/list/` + idCompany);
	}

	register(dataSource: DataSource) {
		return this.http.post(`${config.apiUrl}/data-sources`, dataSource);
	}

	update(dataSource: DataSource) {
		return this.http.put(`${config.apiUrl}/data-sources/` + dataSource.idDataSource, dataSource);
	}

	delete(idDataSource: number) {
		return this.http.delete(`${config.apiUrl}/data-sources/` + idDataSource);
	}
}
