import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Animal } from '../models/animal.model';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8000/api/animals/';

  private animalsState = signal<Animal[]>([]);
  public readonly animals = this.animalsState.asReadonly();

  constructor() {
    this.loadAll();
  }

  private loadAll(): void {
    this.http.get<Animal[]>(this.apiUrl).subscribe((animals) => {
      this.animalsState.set(animals);
    });
  }

  create(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, animal).pipe(
      tap((newAnimal) => {
        this.animalsState.update((currentAnimals) => [...currentAnimals, newAnimal]);
      }),
    );
  }

  update(id: string, animal: Animal): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}${id}/`, animal).pipe(
      tap((updatedAnimal) => {
        this.animalsState.update((currentAnimals) =>
          currentAnimals.map((a) => (a.id === id ? updatedAnimal : a)),
        );
      }),
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`).pipe(
      tap(() => {
        this.animalsState.update((currentAnimals) => currentAnimals.filter((a) => a.id !== id));
      }),
    );
  }
}
