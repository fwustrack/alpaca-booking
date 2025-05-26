import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Animal} from './models/animal.model';
import {AnimalApiService} from './services/animal-api.service';
import {CommonModule} from '@angular/common';
import { MenuItem } from 'primeng/api';
import {MenubarModule} from 'primeng/menubar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MenubarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  animalService = inject(AnimalApiService);
  animals: Animal[] = [];
  menuItems: MenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
    { label: 'Tiere',  routerLink: '/animals' },
    { label: 'Login', icon: 'pi pi-sign-in', routerLink: '/login' }
  ];
  ngOnInit(): void {
    console.log('AppComponent.ngOnInit');
    this.animalService.getAll().subscribe(animals =>
      this.animals = animals);
  }
}
