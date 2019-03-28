import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Evaluation} from '../_models';

@Injectable()
export class EvaluationService {
    constructor(private http: HttpClient) { }

    get(id: number) {
        return this.http.get(`${config.apiUrl}/evaluations/` + id);
    }

    list() {
		return this.http.get(`${config.apiUrl}/evaluations`);
	}

	register(evalutaion: Evaluation) {
		return this.http.post(`${config.apiUrl}/evaluations`, evalutaion);
	}

    update(evalutaion: Evaluation) {
		return this.http.put(`${config.apiUrl}/evaluations/` + evalutaion.idEvaluation, evalutaion);
    }

	delete(idEvaluation: number) {
		return this.http.delete(`${config.apiUrl}/evaluations/` + idEvaluation);
	}
}
