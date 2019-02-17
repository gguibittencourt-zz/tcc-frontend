import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Router} from "@angular/router";
import {User} from "../_models";
import {Observable} from "rxjs";

@Injectable()
export class AuthenticationService {
	constructor(private http: HttpClient, private router: Router) {
	}

	private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private userIn: BehaviorSubject<User> = new BehaviorSubject<User>(null);

	get isLoggedIn() {
		this.loggedIn.next(localStorage.getItem('currentUser') != null);
		return this.loggedIn.asObservable();
	}

	get isUserIn(): Observable<User> {
		this.userIn.next(JSON.parse(localStorage.getItem('currentUser')));
		return this.userIn.asObservable();
	}

	login(username: string, password: string) {
		return this.http.post<any>(`${config.apiUrl}/users/login`, {username: username, password: password})
			.pipe(map(user => {
				// login successful if there's a jwt token in the response
				if (user && user.token) {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					this.setUser(user);
				}

				return user;
			}));
	}

	setUser(user: User): void {
		localStorage.setItem('currentUser', JSON.stringify(user));
		this.loggedIn.next(true);
		this.userIn.next(user);
	}

	logout() {
		// remove user from local storage to log user out
		this.loggedIn.next(false);
		this.userIn.next(null);
		localStorage.removeItem('currentUser');
		this.router.navigate(['/login']);
	}
}
