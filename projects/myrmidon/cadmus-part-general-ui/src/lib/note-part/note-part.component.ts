import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { deepCopy } from '@myrmidon/ng-tools';

import { NotePart, NOTE_PART_TYPEID } from '../note-part';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';

/**
 * Note part editor component.
 * Thesauri: optionally "note-tags", when you want to use a closed set of tags.
 */
@Component({
  selector: 'cadmus-note-part',
  templateUrl: './note-part.component.html',
  styleUrls: ['./note-part.component.css'],
})
export class NotePartComponent
  extends ModelEditorComponentBase<NotePart>
  implements OnInit
{
  public tag: FormControl<string | null>;
  public text: FormControl<string | null>;

  public tagEntries?: ThesaurusEntry[];

  public editorOptions = {
    theme: 'vs-light',
    language: 'markdown',
    wordWrap: 'on',
    // https://github.com/atularen/ngx-monaco-editor/issues/19
    automaticLayout: true,
  };

  constructor(authService: AuthJwtService, formBuilder: FormBuilder) {
    super(authService);
    // form
    this.tag = formBuilder.control(null, Validators.maxLength(100));
    this.text = formBuilder.control(null, Validators.required);
    this.form = formBuilder.group({
      tag: this.tag,
      text: this.text,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model?: NotePart): void {
    if (!model) {
      this.form!.reset();
      return;
    }
    this.tag.setValue(model.tag || null);
    this.text.setValue(model.text);
    this.form!.markAsPristine();
  }

  protected onModelSet(model: NotePart): void {
    this.updateForm(deepCopy(model));
  }

  protected override onThesauriSet(): void {
    const key = 'note-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }
  }

  protected getModelFromForm(): NotePart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId || '',
        id: '',
        typeId: NOTE_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        tag: '',
        text: '',
      };
    }
    part.tag = this.tag.value || undefined;
    part.text = this.text.value?.trim() || '';
    return part;
  }
}
