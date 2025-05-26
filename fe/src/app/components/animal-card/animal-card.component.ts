import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Animal } from '../../models/animal.model';

@Component({
  selector: 'app-animal-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule],
  template: `
    <p-card [style]="{ width: '300px' }" class="animal-card">
      <ng-template pTemplate="header">
        <div class="card-header">
          <h2>{{ animal.name }}</h2>
          <p-tag
            *ngIf="!animal.hasCurrentSponsorship && animal.sponsorshipAvailable"
            severity="info"
            value="Patenschaft verfügbar">
          </p-tag>
        </div>
      </ng-template>

      <p>{{ animal.teaser }}</p>
      <p>{{ animal.description }}</p>

      <ng-template pTemplate="footer">
        <div
          class="sponsorship-info"
          *ngIf="animal.sponsorshipAvailable || animal.hasCurrentSponsorship"
        >
          <div *ngIf="animal.hasCurrentSponsorship" class="current-sponsor">
            <p *ngIf="animal.sponsorName" class="sponsor-message">
              Die Patenschaft für das Jahr 2025 ist an {{ animal.sponsorName }}
              vergeben.
            </p>
            <p *ngIf="animal.sponsorCustomText" class="sponsor-message">
              {{ animal.sponsorCustomText }}
            </p>
          </div>
          <p-button
            *ngIf="!animal.hasCurrentSponsorship && animal.sponsorshipAvailable"
            label="Pate werden"
            styleClass="p-button-outlined p-button-primary">
          </p-button>
        </div>
      </ng-template>
    </p-card>
  `,
  styles: [`
    .animal-card {
      width: 100%;
      transition: transform 0.2s ease-in-out;

      &:hover {
        transform: translateY(-5px);
      }
    }

    .card-header {
      padding: 1rem;
      background-color: var(--surface-ground);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;

      h2 {
        margin: 0;
        color: var(--surface-900);
        font-size: 1.5rem;
      }
    }

    .sponsorship-info {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-200);

      .current-sponsor {
        margin-bottom: 1rem;
      }

      .sponsor-message {
        font-style: italic;
        color: var(--text-color-secondary);
        margin-top: 0.5rem;
      }
    }
  `]
})
export class AnimalCardComponent {
  @Input() animal!: Animal;
}
