import { Component, computed, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../models/animal.model';

@Component({
  selector: 'app-admin-panel',
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CheckboxModule,
    ConfirmDialogModule,
    TooltipModule
],
  providers: [ConfirmationService],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
  host: {
    class: 'content-container',
  },
})
export class AdminPanelComponent {
  private animalService = inject(AnimalService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  animals = this.animalService.animals;

  showDialog = signal(false);
  editMode = signal(false);
  selectedAnimal = signal<Animal | null>(null);

  animalForm = signal<Partial<Animal>>({
    name: '',
    description: '',
    teaser: '',
    sponsorshipAvailable: false,
    hasCurrentSponsorship: false,
    sponsorName: '',
    sponsorCustomText: '',
  });

  dialogTitle = computed(() => (this.editMode() ? 'Tier bearbeiten' : 'Neues Tier hinzufügen'));

  openAddDialog(): void {
    this.editMode.set(false);
    this.selectedAnimal.set(null);
    this.resetForm();
    this.showDialog.set(true);
  }

  openEditDialog(animal: Animal): void {
    this.editMode.set(true);
    this.selectedAnimal.set(animal);
    this.animalForm.set({
      ...animal,
      sponsorshipAvailable: Boolean(animal.sponsorshipAvailable),
      hasCurrentSponsorship: Boolean(animal.hasCurrentSponsorship),
    });
    this.showDialog.set(true);
  }

  hideDialog(): void {
    this.showDialog.set(false);
    this.resetForm();
  }

  saveAnimal(): void {
    const formData = this.animalForm();

    if (!formData.name?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Fehler',
        detail: 'Tiername ist erforderlich',
      });
      return;
    }

    const animalData: Animal = {
      id: this.selectedAnimal()?.id || '',
      name: formData.name.trim(),
      description: formData.description || '',
      teaser: formData.teaser || '',
      sponsorshipAvailable: formData.sponsorshipAvailable || false,
      hasCurrentSponsorship: formData.hasCurrentSponsorship || false,
      sponsorName: formData.sponsorName || '',
      sponsorCustomText: formData.sponsorCustomText || '',
    };

    if (this.editMode() && this.selectedAnimal()) {
      this.animalService.update(this.selectedAnimal()!.id, animalData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Tier erfolgreich aktualisiert',
          });
          this.hideDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Tier konnte nicht aktualisiert werden',
          });
        },
      });
    } else {
      this.animalService.create(animalData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Tier erfolgreich erstellt',
          });
          this.hideDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Tier konnte nicht erstellt werden',
          });
        },
      });
    }
  }

  deleteAnimal(animal: Animal): void {
    this.confirmationService.confirm({
      message: `Sind Sie sicher, dass Sie ${animal.name} löschen möchten?`,
      header: 'Löschen bestätigen',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.animalService.delete(animal.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Erfolg',
              detail: 'Tier erfolgreich gelöscht',
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Fehler',
              detail: 'Tier konnte nicht gelöscht werden',
            });
          },
        });
      },
    });
  }

  private resetForm(): void {
    this.animalForm.set({
      name: '',
      description: '',
      teaser: '',
      sponsorshipAvailable: false,
      hasCurrentSponsorship: false,
      sponsorName: '',
      sponsorCustomText: '',
    });
  }

  updateFormField(field: keyof Animal, value: any): void {
    this.animalForm.update((current) => ({
      ...current,
      [field]: value,
    }));
  }
}
