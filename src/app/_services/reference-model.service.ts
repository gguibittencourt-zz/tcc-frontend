import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ReferenceModel} from '../_models';

@Injectable()
export class ReferenceModelService {
    constructor(private http: HttpClient) { }

    get(id: number) {
        return this.http.get(`${config.apiUrl}/reference-models/` + id);
    }

    list() {
		return this.http.get(`${config.apiUrl}/reference-models`);
	}

	register(referenceModel: ReferenceModel) {
		return this.http.post(`${config.apiUrl}/reference-models`, referenceModel);
	}

    update(referenceModel: ReferenceModel) {
        return this.http.put(`${config.apiUrl}/reference-models/` + referenceModel.idReferenceModel, referenceModel);
    }

}
