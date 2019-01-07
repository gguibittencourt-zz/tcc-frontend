import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {AuthenticationService} from "../_services";

@Component({
	selector: 'nav-bar',
	templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
	isLoggedIn$: Observable<boolean>;

	constructor(private authenticationService: AuthenticationService) {
	}

	ngOnInit() {
		this.isLoggedIn$ = this.authenticationService.isLoggedIn;
	}

	onLogout() {
		this.authenticationService.logout();
	}
}
