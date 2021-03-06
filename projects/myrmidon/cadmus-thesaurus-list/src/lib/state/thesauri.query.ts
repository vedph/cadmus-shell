import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ThesauriStore, ThesauriState } from './thesauri.store';

@Injectable({ providedIn: 'root' })
export class ThesauriQuery extends QueryEntity<ThesauriState> {
  constructor(protected override store: ThesauriStore) {
    super(store);
  }

  /**
   * Remove the thesaurus with the specified ID from the store.
   * @param id The thesaurus' ID.
   */
  public delete(id: string): void {
    this.store.remove(id);
  }
}
