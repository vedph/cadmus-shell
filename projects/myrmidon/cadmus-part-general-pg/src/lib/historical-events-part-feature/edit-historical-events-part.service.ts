import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';
import { EditHistoricalEventsPartStore } from './edit-historical-events-part.store';

@Injectable({ providedIn: 'root' })
export class EditHistoricalEventsPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditHistoricalEventsPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
