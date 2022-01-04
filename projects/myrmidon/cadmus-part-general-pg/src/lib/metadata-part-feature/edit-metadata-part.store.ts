import { Injectable } from '@angular/core';

import { StoreConfig, Store } from '@datorama/akita';

import { METADATA_PART_TYPEID } from '@myrmidon/cadmus-part-general-ui';
import { EditPartState, EditPartStoreApi } from '@myrmidon/cadmus-state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: METADATA_PART_TYPEID })
export class EditMetadataPartStore
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
