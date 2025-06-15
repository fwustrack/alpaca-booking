import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Animal } from '../../models/animal.model';

@Component({
  selector: 'app-animal-card',
  imports: [CardModule, ButtonModule, TagModule],
  templateUrl: './animal-card.component.html',
  styleUrl: './animal-card.component.scss',
})
export class AnimalCardComponent {
  @Input() animal!: Animal;
}
