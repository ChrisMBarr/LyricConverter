import { Injectable } from '@angular/core';
import { ISongError } from '../models/errors.model';
import { Subject } from 'rxjs';
import { CUSTOM_ERROR_IDENTIFIER } from '../shared/constants';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  private errorsList: ISongError[] = [];
  errorsChanged$ = new Subject<ISongError[]>();

  constructor(private readonly $gaService: GoogleAnalyticsService) {}

  add(songError: ISongError): void {
    //If the thrown error is a custom LyricConverter error, use the message from that instead of the default message
    if (this.isCustomLyricConverterError(songError.thrownError)) {
      songError.message = (songError.thrownError as Error).message;
    }

    this.errorsList.push(songError);
    this.errorsChanged$.next(this.errorsList.slice());

    //Log error events to google analytics
    this.$gaService.event('error', 'convert', songError.message);

    console.warn('[LyricConverter Error Service]', songError);
  }

  clear(): void {
    this.errorsList = [];
    this.errorsChanged$.next(this.errorsList.slice());
  }

  private isCustomLyricConverterError(thrownError: unknown): boolean {
    return (
      thrownError != null &&
      Object.hasOwn(thrownError, 'cause') &&
      (thrownError as Error).cause === CUSTOM_ERROR_IDENTIFIER
    );
  }
}
