import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
} from '@angular/forms';

import {
  ModelEditorComponentBase,
  renderLabelFromLastColon,
} from '@myrmidon/cadmus-ui';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { deepCopy } from '@myrmidon/ng-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { DocReference } from '@myrmidon/cadmus-refs-doc-references';
import { AssertedId } from '@myrmidon/cadmus-refs-asserted-ids';

import { Comment, CommentPart, COMMENT_PART_TYPEID } from '../comment-part';
import { IndexKeyword } from '../index-keywords-part';
import { CommentFragment } from '../comment-fragment';

/**
 * Comment part/fragment editor component.
 * Thesauri: comment-tags, doc-reference-tags, doc-reference-types, categories, languages,
 * keyword-indexes, keyword-tags, comment-id-scopes, comment-id-tags (all optional).
 */
@Component({
  selector: 'cadmus-comment-editor',
  templateUrl: './comment-editor.component.html',
  styleUrls: ['./comment-editor.component.css'],
})
export class CommentEditorComponent
  extends ModelEditorComponentBase<CommentPart | CommentFragment>
  implements OnInit
{
  public tag: FormControl<string | null>;
  public text: FormControl<string | null>;
  public references: FormControl<DocReference[]>;
  public ids: FormControl<AssertedId[]>;
  public categories: FormControl<ThesaurusEntry[]>;
  public keywords: FormArray;

  public initialRefs: DocReference[];
  public initialIds: AssertedId[];

  // comment-tags
  public comTagEntries: ThesaurusEntry[] | undefined;
  // doc-reference-tags
  public docTagEntries: ThesaurusEntry[] | undefined;
  // doc-reference-types
  public docTypeEntries: ThesaurusEntry[] | undefined;
  // categories
  public catEntries: ThesaurusEntry[] | undefined;
  // languages
  public langEntries: ThesaurusEntry[] | undefined;
  // keyword-indexes
  public idxEntries: ThesaurusEntry[] | undefined;
  // keyword-tags
  public keyTagEntries: ThesaurusEntry[] | undefined;
  // comment-id-scopes
  public idScopeEntries: ThesaurusEntry[] | undefined;
  // comment-id-tags
  public idTagEntries: ThesaurusEntry[] | undefined;
  // assertion-tags
  public assTagEntries: ThesaurusEntry[] | undefined;

  public editorOptions = {
    theme: 'vs-light',
    language: 'markdown',
    wordWrap: 'on',
    // https://github.com/atularen/ngx-monaco-editor/issues/19
    automaticLayout: true,
  };

  constructor(authService: AuthJwtService, private _formBuilder: FormBuilder) {
    super(authService);
    this.initialRefs = [];
    this.initialIds = [];
    // form
    this.tag = _formBuilder.control(null, Validators.maxLength(50));
    this.text = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50000),
    ]);
    this.references = _formBuilder.control([], { nonNullable: true });
    this.ids = _formBuilder.control([], { nonNullable: true });
    this.categories = _formBuilder.control([], { nonNullable: true });
    this.keywords = _formBuilder.array([]);
    this.form = _formBuilder.group({
      tag: this.tag,
      text: this.text,
      references: this.references,
      ids: this.ids,
      categories: this.categories,
      keywords: this.keywords,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: CommentPart | CommentFragment): void {
    if (!model) {
      this.form!.reset();
      return;
    }
    this.tag.setValue(model.tag || null);
    this.text.setValue(model.text);
    this.initialRefs = model.references || [];
    this.initialIds = model.externalIds || [];
    // keywords
    this.keywords.clear();
    if (model.keywords?.length) {
      for (let keyword of model.keywords) {
        this.keywords.controls.push(this.getKeywordGroup(keyword));
      }
    }
    // categories
    if (model.categories?.length) {
      // map the category IDs to the corresponding thesaurus
      // entries, if any -- else just use the IDs
      const entries: ThesaurusEntry[] = model.categories.map((id) => {
        const entry = this.catEntries?.find((e) => e.id === id);
        return entry
          ? entry
          : {
              id,
              value: id,
            };
      });
      // sort the entries by their display value
      entries.sort((a: ThesaurusEntry, b: ThesaurusEntry) => {
        return a.value.localeCompare(b.value);
      });
      // assign them to the control
      this.categories.setValue(entries || []);
    } else {
      this.categories.setValue([]);
    }

    this.form!.markAsPristine();
  }

  protected onModelSet(model: CommentPart | CommentFragment): void {
    this.updateForm(deepCopy(model));
  }

  protected override onThesauriSet(): void {
    let key = 'comment-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.comTagEntries = this.thesauri[key].entries;
    } else {
      this.comTagEntries = undefined;
    }

    key = 'doc-reference-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.docTagEntries = this.thesauri[key].entries;
    } else {
      this.docTagEntries = undefined;
    }

    key = 'doc-reference-types';
    if (this.thesauri && this.thesauri[key]) {
      this.docTypeEntries = this.thesauri[key].entries;
    } else {
      this.docTypeEntries = undefined;
    }

    key = 'categories';
    if (this.thesauri && this.thesauri[key]) {
      this.catEntries = this.thesauri[key].entries;
    } else {
      this.catEntries = undefined;
    }

    key = 'languages';
    if (this.thesauri && this.thesauri[key]) {
      this.langEntries = this.thesauri[key].entries;
    } else {
      this.langEntries = undefined;
    }

    key = 'keyword-indexes';
    if (this.thesauri && this.thesauri[key]) {
      this.idxEntries = this.thesauri[key].entries;
    } else {
      this.idxEntries = undefined;
    }

    key = 'keyword-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.keyTagEntries = this.thesauri[key].entries;
    } else {
      this.keyTagEntries = undefined;
    }

    key = 'comment-id-scopes';
    if (this.thesauri && this.thesauri[key]) {
      this.idScopeEntries = this.thesauri[key].entries;
    } else {
      this.idScopeEntries = undefined;
    }

    key = 'comment-id-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.idTagEntries = this.thesauri[key].entries;
    } else {
      this.idTagEntries = undefined;
    }
  }

  private updateComment(comment: Comment): void {
    comment.tag = this.tag.value?.trim();
    comment.text = this.text.value?.trim() || '';
    comment.references = this.references.value?.length
      ? this.references.value
      : undefined;
    comment.externalIds = this.ids.value?.length ? this.ids.value : undefined;
    comment.categories = this.categories.value?.length
      ? this.categories.value.map((entry: ThesaurusEntry) => {
          return entry.id;
        })
      : undefined;
    comment.keywords = this.getKeywords();
  }

  protected getModelFromForm(): CommentPart | CommentFragment {
    if ((this.model as CommentFragment).location) {
      let fr: CommentFragment = this.model as CommentFragment;
      if (!fr) {
        fr = {
          location: (this.model as CommentFragment)?.location ?? '',
          text: '',
        };
      }
      this.updateComment(fr);
      return fr;
    } else {
      let part: CommentPart = this.model as CommentPart;
      if (!part) {
        part = {
          itemId: this.itemId || '',
          id: '',
          typeId: COMMENT_PART_TYPEID,
          roleId: this.roleId,
          timeCreated: new Date(),
          creatorId: '',
          timeModified: new Date(),
          userId: '',
          text: '',
        };
      }
      this.updateComment(part);
      return part;
    }
  }

  public onReferencesChange(references: DocReference[]): void {
    this.references.setValue(references || []);
    this.references.updateValueAndValidity();
    this.references.markAsDirty();
    this.form!.markAsDirty();
  }

  public onIdsChange(ids: AssertedId[]): void {
    this.ids.setValue(ids || []);
    this.ids.updateValueAndValidity();
    this.ids.markAsDirty();
    this.form!.markAsDirty();
  }

  //#region Categories
  public onCategoryChange(entry: ThesaurusEntry): void {
    // add the new entry unless already present
    if (this.categories.value?.some((e: ThesaurusEntry) => e.id === entry.id)) {
      return;
    }
    const entries: ThesaurusEntry[] = Object.assign(
      [],
      this.categories.value || []
    );
    entries.push(entry);

    // sort the entries by their display value
    entries.sort((a: ThesaurusEntry, b: ThesaurusEntry) => {
      return a.value.localeCompare(b.value);
    });

    // assign to the categories control
    this.categories.setValue(entries);
    this.categories.updateValueAndValidity();
    this.categories.markAsDirty();
  }

  public removeCategory(index: number): void {
    const entries = Object.assign([], this.categories.value);
    entries.splice(index, 1);
    this.categories.setValue(entries);
    this.categories.updateValueAndValidity();
    this.categories.markAsDirty();
  }

  public renderLabel(label: string): string {
    return renderLabelFromLastColon(label);
  }
  //#endregion

  //#region Keywords
  private getKeywordGroup(keyword?: IndexKeyword): FormGroup {
    return this._formBuilder.group({
      indexId: this._formBuilder.control(
        keyword?.indexId,
        Validators.maxLength(50)
      ),
      tag: this._formBuilder.control(keyword?.tag, Validators.maxLength(50)),
      language: this._formBuilder.control(keyword?.language, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      value: this._formBuilder.control(keyword?.value, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      note: this._formBuilder.control(keyword?.note, Validators.maxLength(500)),
    });
  }

  public addKeyword(keyword?: IndexKeyword): void {
    this.keywords.push(this.getKeywordGroup(keyword));
    this.keywords.markAsDirty();
  }

  public removeKeyword(index: number): void {
    this.keywords.removeAt(index);
    this.keywords.markAsDirty();
  }

  public moveKeywordUp(index: number): void {
    if (index < 1) {
      return;
    }
    const keyword = this.keywords.controls[index];
    this.keywords.removeAt(index);
    this.keywords.insert(index - 1, keyword);
    this.keywords.markAsDirty();
  }

  public moveKeywordDown(index: number): void {
    if (index + 1 >= this.keywords.length) {
      return;
    }
    const keyword = this.keywords.controls[index];
    this.keywords.removeAt(index);
    this.keywords.insert(index + 1, keyword);
    this.keywords.markAsDirty();
  }

  private getKeywords(): IndexKeyword[] | undefined {
    const entries: IndexKeyword[] = [];
    for (let i = 0; i < this.keywords.length; i++) {
      const g = this.keywords.at(i) as FormGroup;
      entries.push({
        indexId: g.controls['indexId'].value?.trim(),
        tag: g.controls['tag'].value?.trim(),
        language: g.controls['language'].value?.trim(),
        value: g.controls['value'].value?.trim(),
        note: g.controls['note'].value?.trim(),
      });
    }
    return entries.length ? entries : undefined;
  }
  //#endregion
}
