import { Injectable } from '@angular/core';

import { FlagService, FacetService, UserService } from '@myrmidon/cadmus-api';
import { UserInfo } from '@myrmidon/cadmus-core';
import { DataPage } from '@myrmidon/ng-tools';

import { ItemsLookupStore } from '../state/items-lookup.store';

@Injectable({ providedIn: 'root' })
export class ItemsLookupService {
  constructor(
    private _facetService: FacetService,
    private _flagService: FlagService,
    private _userService: UserService,
    private _store: ItemsLookupStore
  ) {}

  private loadFacets(): void {
    this._facetService.getFacets().subscribe({
      next: (facets) => {
        this._store.update((state) => {
          return {
            ...state,
            facets,
          };
        });
      },
      error: (err) => {
        this._store.setError(err);
      },
    });
  }

  private loadFlags(): void {
    this._flagService.getFlags().subscribe({
      next: (flags) => {
        this._store.update((state) => {
          return {
            ...state,
            flags,
          };
        });
      },
      error: (err) => {
        this._store.setError(err);
      },
    });
  }

  private loadUsers(): void {
    this._userService.getAllUsers().subscribe({
      next: (page: DataPage<UserInfo>) => {
        this._store.update((state) => {
          return {
            ...state,
            users: page.items.map((u) => {
              return {
                id: u.userName,
                firstName: u.firstName,
                lastName: u.lastName,
              };
            }),
          };
        });
      },
      error: (err) => {
        this._store.setError(err);
      },
    });
  }

  public load(): void {
    this.loadFacets();
    this.loadFlags();
    this.loadUsers();
  }
}
