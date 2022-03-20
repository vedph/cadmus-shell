import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';

import { deepCopy, NgToolsValidators } from '@myrmidon/ng-tools';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { ChronotopesPart, CHRONOTOPES_PART_TYPEID } from '../chronotopes-part';
import { AssertedChronotope } from '@myrmidon/cadmus-refs-asserted-chronotope';

/**
 * Chronotopes part editor component.
 * Thesauri: chronotope-place-tags, chronotope-assertion-tags,
 * chronotope-reference-types, chronotope-reference-tags (all optional).
 */
@Component({
  selector: 'cadmus-chronotopes-part',
  templateUrl: './chronotopes-part.component.html',
  styleUrls: ['./chronotopes-part.component.css'],
})
export class ChronotopesPartComponent
  extends ModelEditorComponentBase<ChronotopesPart>
  implements OnInit
{
  private _editedIndex: number;

  public tabIndex: number;
  public initialChronotope: AssertedChronotope | undefined;
  public editedChronotope: AssertedChronotope | undefined;

  // chronotope-place-tags
  public tagEntries: ThesaurusEntry[] | undefined;
  // chronotope-assertion-tags
  public assTagEntries?: ThesaurusEntry[];
  // chronotope-reference-types
  public refTypeEntries: ThesaurusEntry[] | undefined;
  // chronotope-reference-tags
  public refTagEntries: ThesaurusEntry[] | undefined;

  public chronotopes: FormControl;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService);
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.chronotopes = formBuilder.control(
      [],
      NgToolsValidators.strictMinLengthValidator(1)
    );
    this.form = formBuilder.group({
      entries: this.chronotopes,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: ChronotopesPart): void {
    if (!model) {
      this.form!.reset();
      return;
    }
    this.chronotopes.setValue(model.chronotopes || []);
    this.form!.markAsPristine();
  }

  protected onModelSet(model: ChronotopesPart): void {
    this.updateForm(deepCopy(model));
  }

  protected override onThesauriSet(): void {
    let key = 'chronotope-place-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }

    key = 'chronotope-assertion-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.assTagEntries = this.thesauri[key].entries;
    } else {
      this.assTagEntries = undefined;
    }

    key = 'chronotope-reference-types';
    if (this.thesauri && this.thesauri[key]) {
      this.refTypeEntries = this.thesauri[key].entries;
    } else {
      this.refTypeEntries = undefined;
    }

    key = 'chronotope-reference-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.refTagEntries = this.thesauri[key].entries;
    } else {
      this.refTagEntries = undefined;
    }
  }

  protected getModelFromForm(): ChronotopesPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId || '',
        id: '',
        typeId: CHRONOTOPES_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        chronotopes: [],
      };
    }
    part.chronotopes = this.chronotopes.value || [];
    return part;
  }

  public addChronotope(): void {
    this.chronotopes.setValue([...this.chronotopes.value, {}]);
    this.chronotopes.updateValueAndValidity();
    this.chronotopes.markAsDirty();
    this.editChronotope(this.chronotopes.value.length - 1);
  }

  public editChronotope(index: number): void {
    if (index < 0) {
      this._editedIndex = -1;
      this.tabIndex = 0;
      this.initialChronotope = undefined;
    } else {
      this._editedIndex = index;
      this.initialChronotope = this.chronotopes.value[index];
      setTimeout(() => {
        this.tabIndex = 1;
      }, 300);
    }
  }

  public onChronotopeChange(chronotope: AssertedChronotope): void {
    this.editedChronotope = chronotope;
  }

  public onChronotopeSave(): void {
    this.chronotopes.setValue(
      this.chronotopes.value.map((e: AssertedChronotope, i: number) =>
        i === this._editedIndex ? this.editedChronotope : e
      )
    );
    this.chronotopes.updateValueAndValidity();
    this.chronotopes.markAsDirty();
    this.editChronotope(-1);
  }

  public onChronotopeClose(): void {
    this.editChronotope(-1);
  }

  public deleteChronotope(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete chronotope?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const entries = [...this.chronotopes.value];
          entries.splice(index, 1);
          this.chronotopes.setValue(entries);
          this.chronotopes.updateValueAndValidity();
          this.chronotopes.markAsDirty();
        }
      });
  }

  public moveChronotopeUp(index: number): void {
    if (index < 1) {
      return;
    }
    const entry = this.chronotopes.value[index];
    const entries = [...this.chronotopes.value];
    entries.splice(index, 1);
    entries.splice(index - 1, 0, entry);
    this.chronotopes.setValue(entries);
    this.chronotopes.updateValueAndValidity();
    this.chronotopes.markAsDirty();
  }

  public moveChronotopeDown(index: number): void {
    if (index + 1 >= this.chronotopes.value.length) {
      return;
    }
    const entry = this.chronotopes.value[index];
    const entries = [...this.chronotopes.value];
    entries.splice(index, 1);
    entries.splice(index + 1, 0, entry);
    this.chronotopes.setValue(entries);
    this.chronotopes.updateValueAndValidity();
    this.chronotopes.markAsDirty();
  }
}
