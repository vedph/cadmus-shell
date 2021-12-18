import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';

import {
  LibraryRouteService,
  FacetDefinition,
  Item,
  Part,
} from '@myrmidon/cadmus-core';

import { EditItemStore, EditItemState } from './edit-item.store';

/**
 * The query facade to the edit item store.
 */
@Injectable({ providedIn: 'root' })
export class EditItemQuery extends Query<EditItemState> {
  constructor(
    protected override store: EditItemStore,
    private _libraryRouteService: LibraryRouteService
  ) {
    super(store);
  }

  public selectItem(): Observable<Item | undefined> {
    return this.select((state) => state.item);
  }

  public selectParts(): Observable<Part[]> {
    return this.select((state) => state.parts);
  }

  public selectFacet(): Observable<FacetDefinition | undefined> {
    return this.select((state) => state.facet);
  }

  public selectSaving(): Observable<boolean> {
    return this.select((state) => (state.saving ? true : false));
  }

  public selectDeletingPart(): Observable<boolean> {
    return this.select((state) => (state.deletingPart ? true : false));
  }

  public hasItem(id?: string): boolean {
    const item = this.getValue().item;
    if (!item || (id && id !== item.id)) {
      return false;
    }
    return true;
  }

  public getEditorKeyFromPartTypeId(typeId: string, roleId?: string): string {
    const facet = this.getValue().facet;
    if (!facet) {
      return 'default';
    }
    return this._libraryRouteService.getEditorKeyFromPartType(typeId, roleId)
      .partKey;
  }
}
