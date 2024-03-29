import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Query } from '@datorama/akita';

import {
  FacetDefinition,
  FlagDefinition,
  Thesaurus,
} from '@myrmidon/cadmus-core';

import { AppState, AppStore } from './app.store';

@Injectable({ providedIn: 'root' })
export class AppQuery extends Query<AppState> {
  constructor(protected override store: AppStore) {
    super(store);
  }

  public selectFacets(): Observable<FacetDefinition[]> {
    return this.select((state) => state.facets);
  }

  public selectFlags(): Observable<FlagDefinition[]> {
    return this.select((state) => state.flags);
  }

  public selectTypeThesaurus(): Observable<Thesaurus | undefined> {
    return this.select((state) => state.typeThesaurus);
  }

  public selectItemBrowserThesaurus(): Observable<Thesaurus | undefined> {
    return this.select((state) => state.itemBrowserThesaurus);
  }

  public selectPreviewJKeys(): Observable<string[]> {
    return this.select((state) => state.previewJKeys);
  }

  public selectPreviewFKeys(): Observable<string[]> {
    return this.select((state) => state.previewFKeys);
  }

  public selectPreviewCKeys(): Observable<string[]> {
    return this.select((state) => state.previewCKeys);
  }
}
