import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
} from '@angular/forms';

import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import {
  MetadataPart,
  METADATA_PART_TYPEID,
  Metadatum,
} from '../metadata-part';
import { deepCopy, NgToolsValidators } from '@myrmidon/ng-tools';

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
  implements OnInit
{
  public metadata: FormArray;

  /**
   * metadata-types thesaurus entries.
   */
  public typeEntries: ThesaurusEntry[] | undefined;

  constructor(authService: AuthJwtService, private _formBuilder: FormBuilder) {
    super(authService);
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

  private updateForm(model: MetadataPart): void {
    if (!model) {
      this.form!.reset();
      return;
    }
    this.metadata.clear();
    if (model.metadata) {
      for (let m of model.metadata) {
        this.metadata.controls.push(this.getMetadatumGroup(m));
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
    this.metadata.push(this.getMetadatumGroup(item));
    this.metadata.markAsDirty();
  }

  public removeMetadatum(index: number): void {
    this.metadata.removeAt(index);
    this.metadata.markAsDirty();
  }

  public moveMetadatumUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.metadata.controls[index];
    this.metadata.removeAt(index);
    this.metadata.insert(index - 1, item);
    this.metadata.markAsDirty();
  }

  public moveMetadatumDown(index: number): void {
    if (index + 1 >= this.metadata.length) {
      return;
    }
    const item = this.metadata.controls[index];
    this.metadata.removeAt(index);
    this.metadata.insert(index + 1, item);
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
