import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Assessment} from '../_models';

@Injectable()
export class AssessmentService {
    constructor(private http: HttpClient) { }

    get(id: number) {
        return this.http.get(`${config.apiUrl}/assessments/` + id);
    }

    list() {
		return this.http.get(`${config.apiUrl}/assessments`);
	}

	register(assessment: Assessment) {
		return this.http.post(`${config.apiUrl}/assessments`, assessment);
	}

	finish(assessment: Assessment) {
		return this.http.put(`${config.apiUrl}/assessments/finish`, assessment);
	}

    update(assessment: Assessment) {
		return this.http.put(`${config.apiUrl}/assessments/` + assessment.idAssessment, assessment);
    }

	delete(idAssessment: number) {
		return this.http.delete(`${config.apiUrl}/assessments/` + idAssessment);
	}
}
