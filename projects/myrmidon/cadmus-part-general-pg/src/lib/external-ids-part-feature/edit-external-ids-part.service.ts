import { Injectable } from "@angular/core";
import { ItemService, ThesaurusService } from "@myrmidon/cadmus-api";
import { EditPartServiceBase } from "@myrmidon/cadmus-state";
import { EditExternalIdsPartStore } from "./edit-external-ids-part.store";

@Injectable({ providedIn: "root" })
export class EditExternalIdsPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditExternalIdsPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
