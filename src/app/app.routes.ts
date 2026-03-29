import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login.js';
import { Register } from './features/auth/register/register.js';
import { Home } from './features/home/home.js';
import { Catalog } from './features/recipes/catalog/catalog.js';
import { Details } from './features/recipes/details/details.js';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home | Vigo Recipe' },
  { path: 'recipes', component: Catalog, title: 'Recipes | Vigo Recipe' },
  { path: 'recipes/:id', component: Details, title: 'Recipes Details | Vigo Recipe' },
  { path: 'login', component: Login, title: 'Login | Vigo Recipe' },
  { path: 'register', component: Register, title: 'Register | Vigo Recipe' },
  { path: '**', redirectTo: '' },
];
