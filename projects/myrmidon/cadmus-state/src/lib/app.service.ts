import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

import {
  FacetService,
  FlagService,
  PreviewService,
  ThesaurusService,
} from '@myrmidon/cadmus-api';

import { AppStore } from './app.store';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(
    private _store: AppStore,
    private _facetService: FacetService,
    private _flagService: FlagService,
    private _thesaurusService: ThesaurusService,
    private _previewService: PreviewService
  ) {}

  public load(): void {
    this._store.setLoading(true);

    const facets$ = this._facetService.getFacets();
    const flags$ = this._flagService.getFlags();
    const thesauri$ = this._thesaurusService.getThesauriSet([
      'model-types@en',
      'item-browsers@en',
    ]);
    const rKeys$ = this._previewService.getKeys(false);
    const fKeys$ = this._previewService.getKeys(true);

    forkJoin({
      facets: facets$,
      flags: flags$,
      thesauri: thesauri$,
      rKeys: rKeys$,
      fKeys: fKeys$,
    }).subscribe({
      next: (result) => {
        this._store.setLoading(false);
        this._store.setError(null);

        this._store.update({
          facets: result.facets,
          flags: result.flags,
          typeThesaurus: result.thesauri['model-types'],
          itemBrowserThesaurus: result.thesauri['item-browsers'],
          previewRKeys: result.rKeys,
          previewFKeys: result.fKeys
        });
      },
      error: (error) => {
        console.error(error);
        this._store.setLoading(false);
        this._store.setError('Error loading app state');
      },
    });
  }
}
