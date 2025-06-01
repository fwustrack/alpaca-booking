import { Routes } from '@angular/router';
import { AnimalPage } from './pages/animal-page';
import { LoginPage } from './pages/login-page';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'animals', component: AnimalPage },
];
