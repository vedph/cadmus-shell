import { Injectable } from '@angular/core';

import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';

import { EditMetadataPartStore } from './edit-metadata-part.store';

@Injectable({ providedIn: 'root' })
export class EditMetadataPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditMetadataPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
