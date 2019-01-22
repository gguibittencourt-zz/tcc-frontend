import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {AuthenticationService} from "../../_services/index";
import {User} from "../../_models/index";

@Component({
	selector: 'nav-bar',
	templateUrl: './navbar.component.html',
	styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit {
	isLoggedIn$: Observable<boolean>;
	isUserIn: Observable<User>;

	constructor(private authenticationService: AuthenticationService) {
		this.isLoggedIn$ = this.authenticationService.isLoggedIn;
		this.isUserIn = this.authenticationService.isUserIn;
	}

	ngOnInit() {
		this.isLoggedIn$ = this.authenticationService.isLoggedIn;
		this.isUserIn = this.authenticationService.isUserIn;
	}

	onLogout() {
		this.authenticationService.logout();
	}

	get getUser() : User {
		let user = null;
		this.isUserIn.subscribe(currentUser =>  user = currentUser);
		return user;
	}
}
