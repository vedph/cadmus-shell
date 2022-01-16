import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditChronotopesPartStore } from './edit-chronotopes-part.store';

@Injectable({ providedIn: 'root' })
export class EditChronotopesPartQuery extends EditPartQueryBase {
  constructor(store: EditChronotopesPartStore) {
    super(store);
  }
}
