import {
  FacetDefinition,
  FlagDefinition,
  Thesaurus,
} from '@myrmidon/cadmus-core';
import { Injectable } from '@angular/core';

import { StoreConfig, Store } from '@datorama/akita';

/**
 * General app state, mostly filled with lookup data which can be assumed
 * not to change in the whole session.
 */
export interface AppState {
  /**
   * All the available facets definitions.
   */
  facets: FacetDefinition[];
  /**
   * All the available flags definitions.
   */
  flags: FlagDefinition[];
  /**
   * The thesaurus for model-types. This (if present) is used to display
   * human-friendly part types names from their IDs. Otherwise, the raw
   * IDs are displayed.
   */
  typeThesaurus?: Thesaurus;
  /**
   * The items browsers thesaurus. This (if present) is used to display
   * the items browsers menu.
   */
  itemBrowserThesaurus?: Thesaurus;
  /**
   * The preview JSON renderers keys. Empty when preview is disabled.
   */
  previewJKeys: string[];
  /**
   * The preview text flatteners keys. Empty when preview is disabled.
   */
  previewFKeys: string[];
  /**
   * The preview item composer keys. Empty when preview is disabled.
   */
  previewCKeys: string[];

  loading?: boolean;
  error?: string;
}

const initialState: AppState = {
  facets: [],
  flags: [],
  previewJKeys: [],
  previewFKeys: [],
  previewCKeys: [],
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'app', resettable: false })
export class AppStore extends Store<AppState> {
  constructor() {
    super(initialState);
  }
}
