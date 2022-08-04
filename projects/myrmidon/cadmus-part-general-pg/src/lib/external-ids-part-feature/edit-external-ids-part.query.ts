import { Injectable } from "@angular/core";
import { EditPartQueryBase } from "@myrmidon/cadmus-state";
import { EditExternalIdsPartStore } from "./edit-external-ids-part.store";

@Injectable({ providedIn: "root" })
export class EditExternalIdsPartQuery extends EditPartQueryBase {
  constructor(store: EditExternalIdsPartStore) {
    super(store);
  }
}
