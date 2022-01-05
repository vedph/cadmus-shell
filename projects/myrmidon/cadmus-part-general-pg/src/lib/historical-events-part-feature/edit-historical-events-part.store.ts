import { Injectable } from '@angular/core';
import { StoreConfig, Store } from '@datorama/akita';

import { HISTORICAL_EVENTS_PART_TYPEID } from '@myrmidon/cadmus-part-general-ui';

import { EditPartState, EditPartStoreApi } from '@myrmidon/cadmus-state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: HISTORICAL_EVENTS_PART_TYPEID })
export class EditHistoricalEventsPartStore
  extends Store<EditPartState>
  implements EditPartStoreApi
{
  constructor() {
    super({});
  }

  public setDirty(value: boolean): void {
    this.update({ dirty: value });
  }
  public setSaving(value: boolean): void {
    this.update({ saving: value });
  }
}
