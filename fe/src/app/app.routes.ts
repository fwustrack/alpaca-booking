import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page';
import { AnimalPage } from './pages/animal-page';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'animals', component: AnimalPage },
];
