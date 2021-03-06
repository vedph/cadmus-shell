import { Injectable } from '@angular/core';
import { EditFragmentQueryBase } from '@myrmidon/cadmus-state';
import { EditQuotationsFragmentStore } from './edit-quotations-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditQuotationsFragmentQuery extends EditFragmentQueryBase {
  constructor(protected override store: EditQuotationsFragmentStore) {
    super(store);
  }
}
