import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditNamesPartStore } from './edit-names-part.store';

@Injectable({ providedIn: 'root' })
export class EditNamesPartQuery extends EditPartQueryBase {
  constructor(store: EditNamesPartStore) {
    super(store);
  }
}
