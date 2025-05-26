import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Animal} from './models/animal.model';
import {AnimalApiService} from './services/animal-api.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  animalService = inject(AnimalApiService);
  animals: Animal[] = [];

  ngOnInit(): void {
    console.log('AppComponent.ngOnInit');
    this.animalService.getAll().subscribe(animals =>
      this.animals = animals);
  }
}
