import { Injectable } from '@angular/core';

import { EditPartQueryBase } from '@myrmidon/cadmus-state';

import { EditMetadataPartStore } from './edit-metadata-part.store';

@Injectable({ providedIn: 'root' })
export class EditMetadataPartQuery extends EditPartQueryBase {
  constructor(store: EditMetadataPartStore) {
    super(store);
  }
}
