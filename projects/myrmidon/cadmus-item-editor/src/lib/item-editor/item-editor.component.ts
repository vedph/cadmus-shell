import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  Item,
  PartGroup,
  PartDefinition,
  FacetDefinition,
  FlagDefinition,
  Part,
  LibraryRouteService,
  LayerPartInfo,
  Thesaurus,
  ComponentCanDeactivate,
} from '@myrmidon/cadmus-core';
import {
  EditItemQuery,
  EditItemService,
  AppQuery,
} from '@myrmidon/cadmus-state';
import { DialogService } from '@myrmidon/ng-mat-tools';

import { PartScopeSetRequest } from '../parts-scope-editor/parts-scope-editor.component';
import { AuthJwtService, User } from '@myrmidon/auth-jwt-login';
import { ItemService, UserLevelService } from '@myrmidon/cadmus-api';

/**
 * Item editor. This can edit a new or existing item's metadata and parts.
 */
@Component({
  selector: 'cadmus-item-editor',
  templateUrl: './item-editor.component.html',
  styleUrls: ['./item-editor.component.css'],
})
export class ItemEditorComponent implements OnInit, ComponentCanDeactivate {
  public flagDefinitions: FlagDefinition[];

  public id?: string;
  public item$: Observable<Item | undefined>;
  public parts$: Observable<Part[] | undefined>;
  public partGroups$: Observable<PartGroup[] | undefined>;
  public layerPartInfos$: Observable<LayerPartInfo[] | undefined>;
  public user?: User;
  public userLevel: number;
  // lookup data
  public facet$: Observable<FacetDefinition | undefined>;
  public newPartDefinitions: PartDefinition[];
  public facets$: Observable<FacetDefinition[] | undefined>;
  public loading$: Observable<boolean | undefined>;
  public saving$: Observable<boolean | undefined>;
  public deletingPart$: Observable<boolean | undefined>;
  public error$: Observable<string | undefined>;
  public typeThesaurus$: Observable<Thesaurus | undefined>;
  public previewJKeys$: Observable<string[]>;
  public previewFKeys$: Observable<string[]>;

  // new part form
  public newPartType: FormControl<PartDefinition | null>;
  public newPart: FormGroup;
  // item metadata form
  public title: FormControl<string | null>;
  public sortKey: FormControl<string | null>;
  public description: FormControl<string | null>;
  public facet: FormControl<string | null>;
  public group: FormControl<string | null>;
  public flags: FormControl<number>;
  public flagChecks: FormArray;
  public metadata: FormGroup;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _snackbar: MatSnackBar,
    private _appQuery: AppQuery,
    private _query: EditItemQuery,
    private _editItemService: EditItemService,
    private _itemService: ItemService,
    private _libraryRouteService: LibraryRouteService,
    private _dialogService: DialogService,
    private _authService: AuthJwtService,
    private _userLevelService: UserLevelService,
    private _formBuilder: FormBuilder
  ) {
    this.id = this._route.snapshot.params['id'];
    this.flagDefinitions = [];
    this.newPartDefinitions = [];
    if (this.id === 'new') {
      this.id = undefined;
    }
    // new part form
    this.newPartType = _formBuilder.control(null, Validators.required);
    this.newPart = _formBuilder.group({
      newPartType: this.newPartType,
    });
    // item's metadata form
    this.title = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);
    this.sortKey = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);
    this.sortKey.disable();
    this.description = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(1000),
    ]);
    this.facet = _formBuilder.control(null, Validators.required);
    this.group = _formBuilder.control(null, Validators.maxLength(100));
    this.flags = _formBuilder.control(0, { nonNullable: true });
    this.flagChecks = _formBuilder.array([]);

    this.metadata = _formBuilder.group({
      title: this.title,
      sortKey: this.sortKey,
      description: this.description,
      facet: this.facet,
      group: this.group,
      flagChecks: this.flagChecks,
    });
    this.userLevel = 0;

    this.item$ = this._query.selectItem();
    this.parts$ = this._query.selectParts();
    this.partGroups$ = this._query.select((state) => state.partGroups);
    this.layerPartInfos$ = this._query.select((state) => state.layerPartInfos);
    this.facet$ = this._query.selectFacet();
    this.facets$ = this._appQuery.selectFacets();
    this.typeThesaurus$ = this._appQuery.selectTypeThesaurus();
    this.previewJKeys$ = this._appQuery.selectPreviewJKeys();
    this.previewFKeys$ = this._appQuery.selectPreviewFKeys();

    this.loading$ = this._query.selectLoading();
    this.saving$ = this._query.selectSaving();
    this.deletingPart$ = this._query.selectDeletingPart();
    this.error$ = this._query.selectError();
  }

  ngOnInit(): void {
    this._authService.currentUser$.subscribe((user: User | null) => {
      this.user = user || undefined;
      this.userLevel = this._userLevelService.getCurrentUserLevel();
    });

    // rebuild the flags controls array when flags definitions change
    this._appQuery.selectFlags().subscribe((defs) => {
      this.flagDefinitions = defs;
      this.buildFlagsControls();
    });

    // when flags controls values change, update the flags value
    this.flagChecks.valueChanges.subscribe((_) => {
      this.flags.setValue(this.getFlagsValue());
    });

    // update the metadata form when item changes
    this.item$.subscribe((item) => {
      this.updateMetadataForm(item);
      this.newPartDefinitions = this.getNewPartDefinitions();
    });

    // load the item (if any) and its lookup
    this._editItemService.load(this.id);
  }

  public canDeactivate(): boolean | Observable<boolean> {
    return !this.metadata.dirty;
  }

  private getExistingPartTypeAndRoleIds(): {
    typeId: string;
    roleId?: string;
  }[] {
    const groups = this._query.getValue().partGroups;
    if (!groups) {
      return [];
    }
    const results = [];
    for (const group of groups) {
      for (const part of group.parts) {
        results.push({
          typeId: part.typeId,
          roleId: part.roleId,
        });
      }
    }

    return results;
  }

  private getNewPartDefinitions(): PartDefinition[] {
    const facet = this._query.getValue().facet;
    if (!facet) {
      return [];
    }

    const existingTypeRoleIds = this.getExistingPartTypeAndRoleIds();

    const defs: PartDefinition[] = [];
    for (const def of facet.partDefinitions) {
      // exclude layer parts, as these are in the layers tab
      if (def.roleId?.startsWith('fr.')) {
        continue;
      }
      // exclude parts present in the item
      if (
        existingTypeRoleIds.find((tr) => {
          return (
            tr.typeId === def.typeId &&
            ((!tr.roleId && !def.roleId) || tr.roleId === def.roleId)
          );
        })
      ) {
        continue;
      }
      defs.push(def);
    }
    // sort by sort key
    defs.sort((a, b) => {
      return a.sortKey.localeCompare(b.sortKey);
    });
    return defs;
  }

  /**
   * Builds the array of flags controls according to the current flags
   * definitions and the current flags value.
   */
  private buildFlagsControls(): void {
    this.flagChecks.clear();

    for (const def of this.flagDefinitions) {
      const flagValue = def.id;
      // tslint:disable-next-line: no-bitwise
      const checked = (this.flags.value & flagValue) !== 0;
      this.flagChecks.push(this._formBuilder.control(checked));
    }
  }

  /**
   * Update the flags controls from the current flags value.
   */
  private updateFlagControls(): void {
    if (!this.flagDefinitions) {
      return;
    }
    for (let i = 0; i < this.flagDefinitions.length; i++) {
      const flagValue = this.flagDefinitions[i].id;
      // tslint:disable-next-line: no-bitwise
      const checked = (this.flags.value & flagValue) !== 0;
      this.flagChecks.at(i).setValue(checked);
    }
  }

  /**
   * Get the flags value from the flags controls.
   */
  private getFlagsValue(): number {
    let flagsValue = 0;

    for (let i = 0; i < this.flagDefinitions.length; i++) {
      const flagValue = this.flagDefinitions[i].id;
      if (this.flagChecks.at(i)?.value) {
        // tslint:disable-next-line: no-bitwise
        flagsValue |= flagValue;
      }
    }
    return flagsValue;
  }

  private updateMetadataForm(item?: Item): void {
    if (!item) {
      this.metadata.reset();
      this.updateFlagControls();
    } else {
      this.title.setValue(item.title);
      this.sortKey.setValue(item.sortKey);
      this.description.setValue(item.description);
      this.facet.setValue(item.facetId);
      this.group.setValue(item.groupId);
      this.flags.setValue(item.flags);
      this.updateFlagControls();

      this.metadata.markAsPristine();
    }
  }

  public getTypeIdName(typeId: string): string {
    const state = this._appQuery.getValue();
    if (!state || !state.typeThesaurus) {
      return typeId;
    }
    // strip :suffix if any
    const i = typeId.lastIndexOf(':');
    if (i > -1) {
      typeId = typeId.substring(0, i);
    }
    const entry = state.typeThesaurus.entries?.find((e) => e.id === typeId);
    return entry ? entry.value : typeId;
  }

  public getRoleIdName(roleId: string): string {
    if (!roleId || !roleId.startsWith('fr.')) {
      return roleId;
    }
    return this.getTypeIdName(roleId);
  }

  public save(): void {
    if (!this.metadata.valid) {
      return;
    }
    const item = { ...this._query.getValue().item };
    if (!item) {
      return;
    }
    item.title = this.title.value?.trim();
    item.sortKey = this.sortKey.value?.trim();
    item.description = this.description.value?.trim();
    item.facetId = this.facet.value?.trim() || undefined;
    item.groupId = this.group.value?.trim() || undefined;
    item.flags = this.flags.value;
    // save and reload as edited if was new
    this._editItemService.save(item as Item).then((saved) => {
      this.metadata.markAsPristine();
      if (!item.id) {
        this.id = saved.id;
        this._router.navigate(['/items', saved.id]);
      }
    });
  }

  private partExists(typeId: string, roleId?: string): boolean {
    const groups = this._query.getValue().partGroups;
    if (!groups) {
      return false;
    }
    return groups.some((g) => {
      return g.parts.some(
        (p) =>
          p.typeId === typeId && ((!p.roleId && !roleId) || p.roleId === roleId)
      );
    });
  }

  public addPart(def?: PartDefinition): void {
    if (!def && !this.newPartType.valid) {
      return;
    }
    if (!this.id) {
      this._snackbar.open('Please save the item before adding parts', 'OK', {
        duration: 3000,
      });
      return;
    }
    const typeId = def ? def.typeId : this.newPartType.value!.typeId;
    const roleId = def ? def.roleId : this.newPartType.value!.roleId;

    if (this.partExists(typeId, roleId)) {
      return;
    }

    const route = this._libraryRouteService.buildPartEditorRoute(
      this.id,
      'new',
      typeId,
      roleId
    );

    // navigate to the editor
    this._router.navigate(
      [route.route],
      route.rid
        ? {
            queryParams: {
              rid: route.rid,
            },
          }
        : {}
    );
  }

  public editPart(part: Part): void {
    // build the target route to the appropriate part editor
    const route = this._libraryRouteService.buildPartEditorRoute(
      part.itemId,
      part.id,
      part.typeId,
      part.roleId
    );

    // navigate to the editor
    this._router.navigate(
      [route.route],
      route.rid
        ? {
            queryParams: {
              rid: route.rid,
            },
          }
        : {}
    );
  }

  public previewPart(part: Part): void {
    if (part.roleId?.startsWith('fr.')) {
      // layer parts redirect to base-text
      this._itemService
        .getBaseTextPart(part.itemId)
        .pipe(take(1))
        .subscribe((p) => {
          this._router.navigate(['preview', part.itemId, p.part.id, 'text'], {
            queryParams: { lid: part.roleId },
          });
        });
    } else if (part.roleId === 'base-text') {
      this._router.navigate(['preview', part.itemId, part.id, 'text']);
    } else {
      this._router.navigate(['preview', part.itemId, part.id]);
    }
  }

  public deletePart(part: Part): void {
    this._dialogService
      .confirm('Confirm Deletion', `Delete part "${part.typeId}"?`)
      .subscribe((result) => {
        if (!result) {
          return;
        }
        // delete
        this._editItemService.deletePart(part.id).then(
          (_) => {
            // once deleted, refresh new-part definitions
            this.newPartDefinitions = this.getNewPartDefinitions();
          },
          (error) => {
            console.error(error);
            this._snackbar.open('Error deleting part', 'OK');
          }
        );
      });
  }

  public addLayerPart(part: LayerPartInfo): void {
    let name = this.getTypeIdName(part.typeId);
    if (part.roleId) {
      name += ' for ' + this.getRoleIdName(part.roleId);
    }
    this._dialogService
      .confirm('Confirm Addition', `Add layer "${name}"?`)
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this._editItemService.addNewLayerPart(
          part.itemId,
          part.typeId,
          part.roleId
        );
      });
  }

  public setPartsScope(request: PartScopeSetRequest): void {
    this._editItemService.setPartThesaurusScope(request.ids, request.scope);
  }
}
