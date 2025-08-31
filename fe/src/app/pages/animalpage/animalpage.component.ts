import { Component, computed, inject } from '@angular/core';
import { AnimalCardComponent } from '../../components/animal-card/animal-card.component';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-animalpage',
  imports: [AnimalCardComponent],
  templateUrl: './animalpage.component.html',
  styleUrl: './animalpage.component.scss',
  host: {
    class: 'content-container',
  },
})
export class AnimalpageComponent {
  private animalService = inject(AnimalService);

  animals = this.animalService.animals;

  availableSponserships = computed(
    () =>
      this.animals().filter(
        (animal) => animal.sponsorshipAvailable && !animal.hasCurrentSponsorship,
      ).length,
  );

  activeSponserships = computed(
    () => this.animals().filter((animal) => animal.hasCurrentSponsorship).length,
  );
}
