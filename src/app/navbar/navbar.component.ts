import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {AuthenticationService} from "../_services";
import {User} from "../_models";

@Component({
	selector: 'nav-bar',
	templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
	isLoggedIn$: Observable<boolean>;
	user: User;

	constructor(private authenticationService: AuthenticationService) {
		this.isLoggedIn$ = this.authenticationService.isLoggedIn;
		this.user = this.authenticationService.user;
	}

	ngOnInit() {
		this.isLoggedIn$ = this.authenticationService.isLoggedIn;
		this.user = this.authenticationService.user;
	}

	onLogout() {
		this.authenticationService.logout();
	}
}
