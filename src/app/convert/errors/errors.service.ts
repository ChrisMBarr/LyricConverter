import { Injectable } from '@angular/core';
import { ISongError } from '../models/errors.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  private errorsList: ISongError[] = [];
  errorsChanged$ = new Subject<ISongError[]>();

  add(songError: ISongError): void {
    this.errorsList.push(songError);
    this.errorsChanged$.next(this.errorsList.slice());

    console.warn('[LyricConverter Error Service]', songError);
  }

  clear(): void {
    this.errorsList = [];
    this.errorsChanged$.next(this.errorsList.slice());
  }
}
