import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Router} from "@angular/router";

@Injectable()
export class AuthenticationService {
	constructor(private http: HttpClient, private router: Router) {
	}

	private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	get isLoggedIn() {
		return this.loggedIn.asObservable();
	}

	login(username: string, password: string) {
		return this.http.post<any>(`${config.apiUrl}/users/login`, {username: username, password: password})
			.pipe(map(user => {
				// login successful if there's a jwt token in the response
				if (user && user.token) {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					localStorage.setItem('currentUser', JSON.stringify(user));
					this.loggedIn.next(true);
				}

				return user;
			}));
	}

	logout() {
		// remove user from local storage to log user out
		this.loggedIn.next(false);
		localStorage.removeItem('currentUser');
		this.router.navigate(['/login']);
	}
}
