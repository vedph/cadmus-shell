import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

import { deepCopy, NgToolsValidators } from '@myrmidon/ng-tools';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { AssertedProperName } from '@myrmidon/cadmus-refs-proper-name';

import { NamesPart, NAMES_PART_TYPEID } from '../names-part';

/**
 * Names part editor component.
 * Thesauri: name-languages, name-tags, name-piece-types, assertion-tags,
 * assertion-ref-types, assertion-ref-tags (all optional).
 */
@Component({
  selector: 'cadmus-names-part',
  templateUrl: './names-part.component.html',
  styleUrls: ['./names-part.component.css'],
})
export class NamesPartComponent
  extends ModelEditorComponentBase<NamesPart>
  implements OnInit
{
  private _updatingForm?: boolean;

  public editedIndex: number;
  public editedName: AssertedProperName | undefined;

  /**
   * The optional thesaurus proper name languages entries (name-languages).
   */
  public langEntries: ThesaurusEntry[] | undefined;
  /**
   * The optional thesaurus name's tag entries (name-tags).
   */
  public tagEntries: ThesaurusEntry[] | undefined;
  /**
   * The optional thesaurus name piece's type entries (name-piece-types).
   */
  public typeEntries: ThesaurusEntry[] | undefined;
  // thesauri for assertions:
  // assertion-tags
  public assTagEntries?: ThesaurusEntry[];
  // assertion-ref-types
  public refTypeEntries: ThesaurusEntry[] | undefined;
  // assertion-ref-tags
  public refTagEntries: ThesaurusEntry[] | undefined;

  public names: FormControl;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService);
    this.editedIndex = -1;
    // form
    this.names = formBuilder.control(
      [],
      NgToolsValidators.strictMinLengthValidator(1)
    );
    this.form = formBuilder.group({
      names: this.names,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: NamesPart): void {
    this._updatingForm = true;
    if (!model) {
      this.form!.reset();
    } else {
      this.names.setValue(model.names || []);
      this.form!.markAsPristine();
    }
    this._updatingForm = false;
  }

  protected onModelSet(model: NamesPart): void {
    this.updateForm(deepCopy(model));
  }

  protected override onThesauriSet(): void {
    let key = 'name-languages';
    if (this.thesauri && this.thesauri[key]) {
      this.langEntries = this.thesauri[key].entries;
    } else {
      this.langEntries = undefined;
    }
    key = 'name-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }
    key = 'name-piece-types';
    if (this.thesauri && this.thesauri[key]) {
      this.typeEntries = this.thesauri[key].entries;
    } else {
      this.typeEntries = undefined;
    }
    key = 'assertion-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.assTagEntries = this.thesauri[key].entries;
    } else {
      this.assTagEntries = undefined;
    }
    key = 'assertion-ref-types';
    if (this.thesauri && this.thesauri[key]) {
      this.refTypeEntries = this.thesauri[key].entries;
    } else {
      this.refTypeEntries = undefined;
    }
    key = 'assertion-ref-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.refTagEntries = this.thesauri[key].entries;
    } else {
      this.refTagEntries = undefined;
    }
  }

  protected getModelFromForm(): NamesPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId || '',
        id: '',
        typeId: NAMES_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        names: [],
      };
    }
    part.names = this.names.value || [];
    return part;
  }

  public addName(): void {
    const name: AssertedProperName = {
      language: this.langEntries?.length ? this.langEntries[0].id : '',
      pieces: [],
    };
    this.names.setValue([...(this.names.value || []), name]);
    this.names.updateValueAndValidity();
    this.names.markAsDirty();
    this.editName(this.names.value.length - 1);
  }

  public editName(index: number): void {
    if (index < 0) {
      this.editedIndex = -1;
      this.editedName = undefined;
    } else {
      this.editedIndex = index;
      this.editedName = this.names.value[index];
    }
  }

  public onNameChange(name: AssertedProperName | undefined): void {
    if (this._updatingForm) {
      return;
    }
    // delete if name was emptied
    if (!name) {
      const names = [...(this.names.value || [])];
      names.splice(this.editedIndex, 1);
      this.names.setValue(names);
      this.names.updateValueAndValidity();
      this.names.markAsDirty();
      this.editName(-1);
    } else {
      // else update replacing the old with the new name
      this.names.setValue(
        this.names.value.map((n: AssertedProperName, i: number) =>
          i === this.editedIndex ? name : n
        )
      );
      this.names.updateValueAndValidity();
      this.names.markAsDirty();
    }
  }

  public onNameClose(): void {
    this.editName(-1);
  }

  public deleteName(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete name?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const names = [...this.names.value];
          names.splice(index, 1);
          this.names.setValue(names);
          this.names.updateValueAndValidity();
          this.names.markAsDirty();
        }
      });
  }

  public moveNameUp(index: number): void {
    if (index < 1) {
      return;
    }
    const name = this.names.value[index];
    const names = [...this.names.value];
    names.splice(index, 1);
    names.splice(index - 1, 0, name);
    this.names.setValue(names);
    this.names.updateValueAndValidity();
    this.names.markAsDirty();
  }

  public moveNameDown(index: number): void {
    if (index + 1 >= this.names.value.length) {
      return;
    }
    const name = this.names.value[index];
    const names = [...this.names.value];
    names.splice(index, 1);
    names.splice(index + 1, 0, name);
    this.names.setValue(names);
    this.names.updateValueAndValidity();
    this.names.markAsDirty();
  }
}
