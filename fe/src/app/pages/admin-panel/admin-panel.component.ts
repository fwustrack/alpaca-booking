import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../models/animal.model';

@Component({
  selector: 'app-admin-panel',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CheckboxModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [ConfirmationService, MessageService],
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

  dialogTitle = computed(() => (this.editMode() ? 'Edit Animal' : 'Add New Animal'));

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
        summary: 'Error',
        detail: 'Animal name is required',
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
            summary: 'Success',
            detail: 'Animal updated successfully',
          });
          this.hideDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update animal',
          });
        },
      });
    } else {
      this.animalService.create(animalData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Animal created successfully',
          });
          this.hideDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create animal',
          });
        },
      });
    }
  }

  deleteAnimal(animal: Animal): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${animal.name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.animalService.delete(animal.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Animal deleted successfully',
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete animal',
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
