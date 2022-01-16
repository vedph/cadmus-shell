import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';

import { EditChronotopesPartStore } from './edit-chronotopes-part.store';

@Injectable({ providedIn: 'root' })
export class EditChronotopesPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditChronotopesPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
