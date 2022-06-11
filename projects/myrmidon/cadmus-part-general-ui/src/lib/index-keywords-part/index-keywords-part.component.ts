import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { CadmusValidators, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { deepCopy } from '@myrmidon/ng-tools';

import {
  IndexKeywordsPart,
  IndexKeyword,
  INDEX_KEYWORDS_PART_TYPEID,
} from '../index-keywords-part';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';

/**
 * Index keywords part editor.
 * Thesauri: languages, keyword-indexes, keyword-tags.
 */
@Component({
  selector: 'cadmus-index-keywords-part',
  templateUrl: './index-keywords-part.component.html',
  styleUrls: ['./index-keywords-part.component.css'],
})
export class IndexKeywordsPartComponent
  extends ModelEditorComponentBase<IndexKeywordsPart>
  implements OnInit
{
  public editedKeyword?: IndexKeyword;
  public tabIndex: number;
  // thesaurus
  public idxEntries: ThesaurusEntry[] | undefined;
  public langEntries: ThesaurusEntry[] | undefined;
  public tagEntries: ThesaurusEntry[] | undefined;

  public keywords: FormControl<IndexKeyword[]>;

  constructor(authService: AuthJwtService, formBuilder: FormBuilder) {
    super(authService);
    // form
    this.keywords = formBuilder.control([], {
      validators: CadmusValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
    this.form = formBuilder.group({
      keywords: this.keywords,
    });
    this.tabIndex = 0;
  }

  ngOnInit(): void {
    this.initEditor();
  }

  protected override onThesauriSet(): void {
    let key = 'languages';
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
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }
  }

  private compareKeywords(a: IndexKeyword, b: IndexKeyword): number {
    if (!a) {
      if (!b) {
        return 0;
      } else {
        return -1;
      }
    }
    if (!b) {
      return 1;
    }
    // indexId
    if (!a.indexId && b.indexId) {
      return -1;
    }
    if (a.indexId && !b.indexId) {
      return 1;
    }
    let n: number;
    if (a.indexId && b.indexId) {
      n = a.indexId.localeCompare(b.indexId);
      if (n !== 0) {
        return n;
      }
    }
    n = a.language.localeCompare(b.language);
    if (n !== 0) {
      return n;
    }
    return a.value.localeCompare(b.value);
  }

  private updateForm(model?: IndexKeywordsPart): void {
    if (!model) {
      this.form!.reset();
      return;
    }

    const keywords: IndexKeyword[] = Object.assign([], model.keywords);
    keywords.sort(this.compareKeywords);
    this.keywords.setValue(keywords);
    this.form!.markAsPristine();
  }

  protected onModelSet(model: IndexKeywordsPart): void {
    this.updateForm(deepCopy(model));
  }

  protected getModelFromForm(): IndexKeywordsPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId || '',
        id: '',
        typeId: INDEX_KEYWORDS_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        keywords: [],
      };
    }
    part.keywords = [...this.keywords.value];
    return part;
  }

  private addKeyword(keyword: IndexKeyword): boolean {
    let i = 0;
    while (i < this.keywords.value.length) {
      const n = this.compareKeywords(keyword, this.keywords.value[i]);
      if (n === 0) {
        return false;
      }
      if (n <= 0) {
        const keywords: IndexKeyword[] = Object.assign([], this.keywords.value);
        keywords.splice(i, 0, keyword);
        this.keywords.setValue(keywords);
        break;
      }
      i++;
    }
    if (i === this.keywords.value.length) {
      const keywords: IndexKeyword[] = Object.assign([], this.keywords.value);
      keywords.push(keyword);
      this.keywords.setValue(keywords);
    }

    this.keywords.markAsDirty();
    this.keywords.updateValueAndValidity();

    return true;
  }

  public addNewKeyword(): void {
    const keyword: IndexKeyword = {
      indexId: this.idxEntries?.length ? this.idxEntries[0].id : undefined,
      language: this.langEntries?.length ? this.langEntries[0].id : 'eng',
      value: '',
    };
    this.editKeyword(keyword);
  }

  public deleteKeyword(keyword: IndexKeyword): void {
    const keywords: IndexKeyword[] = [...this.keywords.value];
    keywords.splice(keywords.indexOf(keyword), 1);
    this.keywords.setValue(keywords);
    this.keywords.updateValueAndValidity();
    this.keywords.markAsDirty();
  }

  public editKeyword(keyword: IndexKeyword): void {
    this.editedKeyword = keyword;
    this.tabIndex = 1;
  }

  public onKeywordClose(): void {
    this.tabIndex = 0;
    this.editedKeyword = undefined;
  }

  public onKeywordSave(keyword: IndexKeyword): void {
    this.tabIndex = 0;
    this.addKeyword(keyword);
    this.editedKeyword = undefined;
  }
}
