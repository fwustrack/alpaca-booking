import { Routes } from '@angular/router';
import { AnimalpageComponent } from './pages/animalpage/animalpage.component';
import { DirectionspageComponent } from './pages/directionspage/directionspage.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginpageComponent } from './pages/loginpage/loginpage.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginpageComponent },
  { path: 'animals', component: AnimalpageComponent },
  { path: 'directions', component: DirectionspageComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];
