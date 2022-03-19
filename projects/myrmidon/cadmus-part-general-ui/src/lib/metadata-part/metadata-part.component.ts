import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';

import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import {
  MetadataPart,
  METADATA_PART_TYPEID,
  Metadatum,
} from '../metadata-part';
import { deepCopy, NgToolsValidators } from '@myrmidon/ng-tools';
import { Subscription } from 'rxjs';

/**
 * Metadata part editor component.
 * Thesauri: metadata-types (optional).
 */
@Component({
  selector: 'cadmus-metadata-part',
  templateUrl: './metadata-part.component.html',
  styleUrls: ['./metadata-part.component.css'],
})
export class MetadataPartComponent
  extends ModelEditorComponentBase<MetadataPart>
  implements OnInit, OnDestroy
{
  private _subs: Subscription[];
  public metadata: FormArray;

  /**
   * metadata-types thesaurus entries.
   */
  public typeEntries: ThesaurusEntry[] | undefined;

  constructor(authService: AuthJwtService, private _formBuilder: FormBuilder) {
    super(authService);
    this._subs = [];
    // form
    this.metadata = _formBuilder.array(
      [],
      NgToolsValidators.strictMinLengthValidator(1)
    );
    this.form = _formBuilder.group({
      metadata: this.metadata,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  private unsubscribe(): void {
    for (let i = 0; i < this._subs.length; i++) {
      this._subs[i].unsubscribe();
    }
    this._subs.length = 0;
  }

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  private updateForm(model: MetadataPart): void {
    if (!model) {
      this.form!.reset();
      return;
    }
    this.metadata.clear();
    this.unsubscribe();
    if (model.metadata) {
      for (let m of model.metadata) {
        const g = this.getMetadatumGroup(m);
        this._subs.push(
          g.valueChanges.subscribe((_) => {
            this.metadata.updateValueAndValidity();
            this.metadata.markAsDirty();
          })
        );
        this.metadata.controls.push(g);
      }
    }
    this.form!.markAsPristine();
  }

  protected onModelSet(model: MetadataPart): void {
    this.updateForm(deepCopy(model));
  }

  protected override onThesauriSet(): void {
    const key = 'metadata-types';
    if (this.thesauri && this.thesauri[key]) {
      this.typeEntries = this.thesauri[key].entries;
    } else {
      this.typeEntries = undefined;
    }
  }

  protected getModelFromForm(): MetadataPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId || '',
        id: '',
        typeId: METADATA_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        metadata: [],
      };
    }
    part.metadata = this.getMetadata();
    return part;
  }

  private getMetadatumGroup(item?: Metadatum): FormGroup {
    return this._formBuilder.group({
      type: this._formBuilder.control(item?.type, Validators.maxLength(100)),
      name: this._formBuilder.control(item?.name, [
        Validators.required,
        Validators.maxLength(500),
      ]),
      value: this._formBuilder.control(item?.value, [
        Validators.required,
        Validators.maxLength(1000),
      ]),
    });
  }

  public addMetadatum(item?: Metadatum): void {
    const g = this.getMetadatumGroup(item);
    this._subs.push(g.valueChanges.subscribe(_ => {
      this.metadata.updateValueAndValidity();
      this.metadata.markAsDirty();
    }));
    this.metadata.push(g);
    this.metadata.updateValueAndValidity();
    this.metadata.markAsDirty();
  }

  public removeMetadatum(index: number): void {
    this._subs[index].unsubscribe();
    this._subs.splice(index, 1);
    this.metadata.removeAt(index);
    this.metadata.updateValueAndValidity();
    this.metadata.markAsDirty();
  }

  public moveMetadatumUp(index: number): void {
    if (index < 1) {
      return;
    }
    const s = this._subs[index];
    this._subs.splice(index, 1);
    this._subs.splice(index - 1, 0, s);

    const item = this.metadata.controls[index];
    this.metadata.removeAt(index);
    this.metadata.insert(index - 1, item);
    this.metadata.updateValueAndValidity();
    this.metadata.markAsDirty();
  }

  public moveMetadatumDown(index: number): void {
    if (index + 1 >= this.metadata.length) {
      return;
    }
    const s = this._subs[index];
    this._subs.splice(index, 1);
    this._subs.splice(index + 1, 0, s);

    const item = this.metadata.controls[index];
    this.metadata.removeAt(index);
    this.metadata.insert(index + 1, item);
    this.metadata.updateValueAndValidity();
    this.metadata.markAsDirty();
  }

  private getMetadata(): Metadatum[] {
    const entries: Metadatum[] = [];
    for (let i = 0; i < this.metadata.length; i++) {
      const g = this.metadata.at(i) as FormGroup;
      entries.push({
        type: g.controls['type'].value?.trim(),
        name: g.controls['name'].value?.trim(),
        value: g.controls['value'].value?.trim(),
      });
    }
    return entries;
  }
}
