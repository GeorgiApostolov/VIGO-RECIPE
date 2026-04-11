import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard.js';
import { guestGuard } from './core/guards/guest-guard.js';
import { Login } from './features/auth/login/login.js';
import { Register } from './features/auth/register/register.js';
import { Home } from './features/home/home.js';
import { Create } from './features/recipes/create/create.js';
import { Delete } from './features/recipes/delete/delete.js';
import { Edit } from './features/recipes/edit/edit.js';
import { MyRecipes } from './features/recipes/my-recipes/my-recipes.js';
import { Catalog } from './features/recipes/catalog/catalog.js';
import { Details } from './features/recipes/details/details.js';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home | Vigo Recipe' },
  { path: 'recipes', component: Catalog, title: 'Recipes | Vigo Recipe' },
  {
    path: 'recipes/create',
    component: Create,
    canActivate: [authGuard],
    title: 'Create Recipe | Vigo Recipe',
  },
  {
    path: 'recipes/:id/edit',
    component: Edit,
    canActivate: [authGuard],
    title: 'Edit Recipe | Vigo Recipe',
  },
  {
    path: 'recipes/:id/delete',
    component: Delete,
    canActivate: [authGuard],
    title: 'Delete Recipe | Vigo Recipe',
  },
  { path: 'recipes/:id', component: Details, title: 'Recipe Details | Vigo Recipe' },
  {
    path: 'my-recipes',
    component: MyRecipes,
    canActivate: [authGuard],
    title: 'My Recipes | Vigo Recipe',
  },
  { path: 'login', component: Login, canActivate: [guestGuard], title: 'Login | Vigo Recipe' },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
    title: 'Register | Vigo Recipe',
  },
  { path: '**', redirectTo: '' },
];
