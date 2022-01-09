import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';
import { EditNamesPartStore } from './edit-names-part.store';

@Injectable({ providedIn: 'root' })
export class EditNamesPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditNamesPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
