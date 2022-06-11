import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { CadmusValidators, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { deepCopy } from '@myrmidon/ng-tools';
import { DialogService } from '@myrmidon/ng-mat-tools';

import { QuotationWorksService } from './quotation-works.service';
import { QuotationsFragment, QuotationEntry } from '../quotations-fragment';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';

/**
 * Quotations fragment editor.
 * Thesauri: quotation-works (optional), quotation-tags (optional).
 */
@Component({
  selector: 'cadmus-quotations-fragment',
  templateUrl: './quotations-fragment.component.html',
  styleUrls: ['./quotations-fragment.component.css'],
})
export class QuotationsFragmentComponent
  extends ModelEditorComponentBase<QuotationsFragment>
  implements OnInit
{
  private _newEditedEntry?: boolean;

  public editedEntry?: QuotationEntry;
  public currentTabIndex: number;

  public workEntries: ThesaurusEntry[] | undefined;
  public tagEntries: ThesaurusEntry[] | undefined;
  public workDictionary?: Record<string, ThesaurusEntry[]>;

  public entries: FormControl<QuotationEntry[]>;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _worksService: QuotationWorksService
  ) {
    super(authService);
    this.currentTabIndex = 0;
    // form
    this.entries = formBuilder.control([], {
      validators: CadmusValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });

    this.form = formBuilder.group({
      entries: this.entries,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  protected override onThesauriSet(): void {
    let key = 'quotation-works';
    if (this.thesauri && this.thesauri[key]) {
      this.workEntries = this.thesauri[key].entries;
      this.workDictionary = this._worksService.buildDictionary(
        this.workEntries || []
      );
    } else {
      this.workEntries = undefined;
      this.workDictionary = undefined;
    }

    key = 'quotation-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }
  }

  private updateForm(model: QuotationsFragment): void {
    if (!model) {
      this.form!.reset();
      return;
    }
    this.entries.setValue(model.entries);
    this.form!.markAsPristine();
  }

  protected onModelSet(model: QuotationsFragment): void {
    this.updateForm(deepCopy(model));
  }

  protected getModelFromForm(): QuotationsFragment {
    return {
      location: this.model?.location ?? '',
      entries: this.entries.value,
    };
  }

  public getNameFromId(id: string): string {
    return this.workEntries?.find((e) => e.id === id)?.value || id;
  }

  public addEntry(): void {
    const entry: QuotationEntry = {
      author: '',
      work: '',
      citation: '',
    };
    this.entries.setValue([...this.entries.value, entry]);
    this.entries.updateValueAndValidity();
    this.entries.markAsDirty();
    this._newEditedEntry = true;
    this.editEntry(entry);
  }

  public editEntry(entry: QuotationEntry): void {
    this.editedEntry = entry;
    this.currentTabIndex = 1;
  }

  public onEntrySave(entry: QuotationEntry): void {
    if (!this.editedEntry) {
      return;
    }
    this._newEditedEntry = false;
    const i = this.entries.value.indexOf(this.editedEntry);
    const entries = [...this.entries.value];
    entries.splice(i, 1, entry);
    this.entries.setValue(entries);
    this.entries.updateValueAndValidity();
    this.entries.markAsDirty();
    this.currentTabIndex = 0;
    this.editedEntry = undefined;
  }

  public onEntryClose(entry: QuotationEntry): void {
    if (!this.editedEntry) {
      return;
    }
    if (this._newEditedEntry) {
      const index = this.entries.value.indexOf(this.editedEntry);
      this.entries.setValue([...this.entries.value].splice(index, 1));
      this.entries.updateValueAndValidity();
      this.entries.markAsDirty();
    }
    this.currentTabIndex = 0;
    this.editedEntry = undefined;
  }

  public removeEntry(index: number): void {
    this._dialogService
      .confirm('Confirm Deletion', 'Delete entry?')
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.entries.setValue([...this.entries.value].splice(index, 1));
        this.entries.updateValueAndValidity();
        this.entries.markAsDirty();
      });
  }

  public moveEntryUp(index: number): void {
    if (index < 1) {
      return;
    }
    const entry = this.entries.value[index];
    const entries = [...this.entries.value];
    entries.splice(index, 1);
    entries.splice(index - 1, 0, entry);
    this.entries.setValue(entries);
    this.entries.updateValueAndValidity();
    this.entries.markAsDirty();
  }

  public moveEntryDown(index: number): void {
    if (index + 1 >= this.entries.value.length) {
      return;
    }
    const entry = this.entries.value[index];
    const entries = [...this.entries.value];
    entries.splice(index, 1);
    entries.splice(index + 1, 0, entry);
    this.entries.setValue(entries);
    this.entries.updateValueAndValidity();
    this.entries.markAsDirty();
  }
}
