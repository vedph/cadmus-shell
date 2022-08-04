import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';

import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesaurusEntry, CadmusValidators } from '@myrmidon/cadmus-core';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { deepCopy } from '@myrmidon/ng-tools';

import {
  ExternalIdsPart,
  EXTERNAL_IDS_PART_TYPEID,
} from '../external-ids-part';
import { AssertedId } from '@myrmidon/cadmus-refs-asserted-ids';

/**
 * External IDs part editor component. This is just a collection of asserted
 * IDs.
 * Thesauri: external-id-types, external-id-tags, assertion-tags,
 * doc-reference-types, doc-reference-tags (all optional).
 */
@Component({
  selector: 'cadmus-refs-external-ids-part',
  templateUrl: './external-ids-part.component.html',
  styleUrls: ['./external-ids-part.component.css'],
})
export class ExternalIdsPartComponent
  extends ModelEditorComponentBase<ExternalIdsPart>
  implements OnInit
{
  public initialIds: AssertedId[];
  public ids: FormControl<AssertedId[]>;

  // external-id-scopes
  public scopeEntries: ThesaurusEntry[] | undefined;
  // external-id-tags
  public tagEntries: ThesaurusEntry[] | undefined;

  // thesauri for assertions:
  // assertion-tags
  public assTagEntries: ThesaurusEntry[] | undefined;
  // doc-reference-types
  public refTypeEntries: ThesaurusEntry[] | undefined;
  // doc-reference-tags
  public refTagEntries: ThesaurusEntry[] | undefined;

  constructor(authService: AuthJwtService, formBuilder: FormBuilder) {
    super(authService);
    this.initialIds = [];
    // form
    this.ids = formBuilder.control([], {
      validators: CadmusValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
    this.form = formBuilder.group({
      ids: this.ids,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: ExternalIdsPart): void {
    if (!model) {
      this.form?.reset();
      return;
    }
    this.initialIds = model.ids || [];
    this.form?.markAsPristine();
  }

  protected onModelSet(model: ExternalIdsPart): void {
    this.updateForm(deepCopy(model));
  }

  protected override onThesauriSet(): void {
    let key = 'assertion-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.assTagEntries = this.thesauri[key].entries;
    } else {
      this.assTagEntries = undefined;
    }

    key = 'doc-reference-types';
    if (this.thesauri && this.thesauri[key]) {
      this.refTypeEntries = this.thesauri[key].entries;
    } else {
      this.refTypeEntries = undefined;
    }

    key = 'doc-reference-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.refTagEntries = this.thesauri[key].entries;
    } else {
      this.refTagEntries = undefined;
    }

    key = 'external-id-scopes';
    if (this.thesauri && this.thesauri[key]) {
      this.scopeEntries = this.thesauri[key].entries;
    } else {
      this.scopeEntries = undefined;
    }

    key = 'external-id-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }
  }

  protected getModelFromForm(): ExternalIdsPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId || '',
        id: '',
        typeId: EXTERNAL_IDS_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        ids: [],
      };
    }
    part.ids = this.ids.value;
    return part;
  }

  public onIdsChange(ids: AssertedId[]): void {
    this.ids.setValue(ids);
  }
}
