import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AnimalCardComponent } from '../components/animal-card/animal-card.component';
import { Animal } from '../models/animal.model';
import { AnimalApiService } from '../services/animal-api.service';

@Component({
  standalone: true,
  selector: 'app-animal-page',
  imports: [CommonModule, AnimalCardComponent],
  template: `
    <div class="animal-page-container">
      <h1>Unsere Tiere</h1>
      <div class="animal-grid">
        <app-animal-card *ngFor="let animal of animals" [animal]="animal"> </app-animal-card>
      </div>
    </div>
  `,
  styles: [
    `
      .animal-page-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        text-align: center;
        margin-bottom: 2rem;
        color: var(--surface-900);
      }

      .animal-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, 300px);
        gap: 2rem;
        justify-content: center;
      }
    `,
  ],
})
export class AnimalPage implements OnInit {
  animals: Animal[] = [];

  constructor(private animalService: AnimalApiService) {}

  ngOnInit() {
    this.animalService.getAll().subscribe((data) => {
      this.animals = data;
    });
  }
}
