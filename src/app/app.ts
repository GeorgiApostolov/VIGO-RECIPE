import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './core/layout/footer/footer.js';
import { Header } from './core/layout/header/header.js';
import { Auth } from './core/services/auth.js';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private auth = inject(Auth);

  ngOnInit(): void {
    this.auth.restoreSession();
  }
}
