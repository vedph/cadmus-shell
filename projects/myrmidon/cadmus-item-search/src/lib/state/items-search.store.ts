import { StoreConfig, EntityStore, EntityState } from '@datorama/akita';
import { ItemInfo } from '@myrmidon/cadmus-core';
import { Injectable } from '@angular/core';

export interface ItemsSearchState extends EntityState<ItemInfo, string> {
  query?: string;
  lastQueries: string[];
}

const initialState = {
  lastQueries: [],
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'items-search' })
export class ItemsSearchStore extends EntityStore<ItemsSearchState> {
  constructor() {
    super(initialState);
  }
}
