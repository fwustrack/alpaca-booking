import { Component, OnInit } from '@angular/core';
import { AnimalCardComponent } from '../../components/animal-card/animal-card.component';
import { Animal } from '../../models/animal.model';
import { AnimalApiService } from '../../services/animal-api.service';

@Component({
  selector: 'app-animalpage',
  imports: [AnimalCardComponent],
  templateUrl: './animalpage.component.html',
  styleUrl: './animalpage.component.scss',
})
export class AnimalpageComponent implements OnInit {
  animals: Animal[] = [];

  constructor(private animalService: AnimalApiService) {}

  ngOnInit() {
    this.animalService.getAll().subscribe((data) => {
      this.animals = data;
    });
  }
}
