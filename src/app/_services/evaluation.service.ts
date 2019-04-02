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

	register(evaluation: Evaluation) {
		return this.http.post(`${config.apiUrl}/evaluations`, evaluation);
	}

    update(evaluation: Evaluation) {
		return this.http.put(`${config.apiUrl}/evaluations/` + evaluation.idEvaluation, evaluation);
    }

	delete(idEvaluation: number) {
		return this.http.delete(`${config.apiUrl}/evaluations/` + idEvaluation);
	}
}
