import { Injectable } from '@angular/core';
import {
  ItemsLookupState,
  ItemsLookupStore,
} from './items-lookup.store';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class ItemsLookupQuery extends Query<ItemsLookupState> {
  constructor(protected override store: ItemsLookupStore) {
    super(store);
  }
}
