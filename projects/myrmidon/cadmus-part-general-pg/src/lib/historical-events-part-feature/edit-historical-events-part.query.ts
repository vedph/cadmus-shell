import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditHistoricalEventsPartStore } from './edit-historical-events-part.store';

@Injectable({ providedIn: 'root' })
export class EditHistoricalEventsPartQuery extends EditPartQueryBase {
  constructor(store: EditHistoricalEventsPartStore) {
    super(store);
  }
}
