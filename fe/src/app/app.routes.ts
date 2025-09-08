import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { AnimalpageComponent } from './pages/animalpage/animalpage.component';
import { DirectionspageComponent } from './pages/directionspage/directionspage.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginpageComponent } from './pages/loginpage/loginpage.component';
import { ToursEventsComponent } from './pages/tours-events/tours-events.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginpageComponent },
  { path: 'tours-events', component: ToursEventsComponent },
  { path: 'animals', component: AnimalpageComponent },
  { path: 'directions', component: DirectionspageComponent },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];
