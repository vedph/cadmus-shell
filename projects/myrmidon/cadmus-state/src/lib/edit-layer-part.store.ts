import { StoreConfig, Store } from '@datorama/akita';
import {
  TextLayerPart,
  Part,
  LayerHint,
  ThesauriSet,
  TokenLocation,
} from '@myrmidon/cadmus-core';
import { Injectable } from '@angular/core';

/**
 * The state of the currently edited text layer part, if any.
 * This state is set when editing a text layer.
 */
export interface EditLayerPartState {
  /**
   * The layer part (=collection of fragments) being edited.
   */
  part?: TextLayerPart;
  /**
   * The base text rendered into a plain string, whatever its original model.
   * This is used for reference (e.g. show it to the user while editing),
   * even if in some cases it can be enough to work with the base text in the
   * layer part editor itself (this is the case of the token-based text,
   * but not e.g. for the tiles-based text).
   */
  baseText?: string;
  /**
   * The base text part.
   */
  baseTextPart?: Part;
  /**
   * The fragments locations, collected from all the fragments.
   */
  locations: TokenLocation[];
  /**
   * The estimated chance of broken fragments in this layer: 0=safe,
   * 1=potentially broken, 2=broken.
   */
  breakChance: number;
  /**
   * The layer fragments reconciliation hints. There is one hint for each
   * fragment in the layer.
   */
  layerHints: LayerHint[];
  // this is implemented in Akita stores, but you must add the keys
  // https://github.com/datorama/akita/issues/61
  thesauri: ThesauriSet;
  loading?: boolean;
  error?: string;
  deletingFragment?: boolean;
  savingFragment?: boolean;
  refreshingBreakChance?: boolean;
  patchingLayer?: boolean;
}

const initialState: EditLayerPartState = {
  locations: [],
  breakChance: -1,
  layerHints: [],
  thesauri: {},
  loading: false,
  deletingFragment: false,
  savingFragment: false,
  refreshingBreakChance: false,
  patchingLayer: false,
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'edit-layer-part' })
export class EditLayerPartStore extends Store<EditLayerPartState> {
  constructor() {
    super(initialState);
  }

  public setDeletingFragment(value = true): void {
    this.update({ deletingFragment: value });
  }

  public setSavingFragment(value = true): void {
    this.update({ savingFragment: value });
  }

  public setRefreshingBreakChance(value = true): void {
    this.update({ refreshingBreakChance: value });
  }

  public setBreakChance(value: number): void {
    this.update({ breakChance: value });
  }

  public setPatchingLayer(value = true): void {
    this.update({ patchingLayer: value });
  }

  public setLocations(locations: TokenLocation[]): void {
    this.update({ locations });
  }
}
