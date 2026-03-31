import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth.js';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private auth = inject(Auth);

  currentUser$ = this.auth.currentUser$;
  isLoggedIn$ = this.auth.isLoggedIn$;

  logout(): void {
    this.auth.logout();
  }
}
