import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MeasurementFramework} from '../_models';

@Injectable()
export class MeasurementFrameworkService {
    constructor(private http: HttpClient) { }

    get(id: number) {
        return this.http.get(`${config.apiUrl}/measurement-framework/` + id);
    }

    list() {
		return this.http.get(`${config.apiUrl}/measurement-framework`);
	}

	register(measurementFramework: MeasurementFramework) {
		return this.http.post(`${config.apiUrl}/measurement-framework`, measurementFramework);
	}

    update(measurementFramework: MeasurementFramework) {
		return this.http.put(`${config.apiUrl}/measurement-framework/` + measurementFramework.idMeasurementFramework, measurementFramework);
    }

	delete(idMeasurementFramework: number) {
		return this.http.delete(`${config.apiUrl}/measurement-framework/` + idMeasurementFramework);
	}
}
