import { Component, inject } from '@angular/core';
import { AnimalCardComponent } from '../../components/animal-card/animal-card.component';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-animalpage',
  imports: [AnimalCardComponent],
  templateUrl: './animalpage.component.html',
  styleUrl: './animalpage.component.scss',
})
export class AnimalpageComponent {
  private animalService = inject(AnimalService);

  animals = this.animalService.animals;
}
