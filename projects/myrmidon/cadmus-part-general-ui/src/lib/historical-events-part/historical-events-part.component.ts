import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';

import { deepCopy, NgToolsValidators } from '@myrmidon/ng-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { DialogService } from '@myrmidon/ng-mat-tools';

import {
  HistoricalEvent,
  HistoricalEventsPart,
  HISTORICAL_EVENTS_PART_TYPEID,
} from '../historical-events-part';

/**
 * Historical events part.
 * Thesauri (all optional): event-types, event-relations, chronotope-tags,
 * assertion-tags, doc-reference-tags, doc-reference-types.
 */
@Component({
  selector: 'cadmus-historical-events-part',
  templateUrl: './historical-events-part.component.html',
  styleUrls: ['./historical-events-part.component.css'],
})
export class HistoricalEventsPartComponent
  extends ModelEditorComponentBase<HistoricalEventsPart>
  implements OnInit
{
  private _editedIndex: number;

  public tabIndex: number;
  public editedEvent: HistoricalEvent | undefined;

  /**
   * Thesaurus event-types.
   */
  public eventTypeEntries: ThesaurusEntry[] | undefined;
  /**
   * Thesaurus event-relations.
   */
  public relationEntries: ThesaurusEntry[] | undefined;
  /**
   * Thesaurus chronotope-tags.
   */
  public ctTagEntries: ThesaurusEntry[] | undefined;
  /**
   * Thesaurus assertion-tags.
   */
  public assTagEntries: ThesaurusEntry[] | undefined;
  /**
   * Thesaurus doc-reference-tags.
   */
  public refTagEntries: ThesaurusEntry[] | undefined;
  /**
   * Thesaurus doc-reference-types.
   */
  public refTypeEntries: ThesaurusEntry[] | undefined;

  public events: FormControl;

  constructor(
    authService: AuthJwtService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService);
    this._editedIndex = -1;
    this.tabIndex = 0;
    // form
    this.events = formBuilder.control(
      [],
      NgToolsValidators.strictMinLengthValidator(1)
    );
    this.form = formBuilder.group({
      events: this.events,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: HistoricalEventsPart): void {
    if (!model) {
      this.form!.reset();
      return;
    }
    this.events.setValue(model.events || []);
    this.form!.markAsPristine();
  }

  protected onModelSet(model: HistoricalEventsPart): void {
    this.updateForm(deepCopy(model));
  }

  protected override onThesauriSet(): void {
    let key = 'event-types';
    if (this.thesauri && this.thesauri[key]) {
      this.eventTypeEntries = this.thesauri[key].entries;
    } else {
      this.eventTypeEntries = undefined;
    }
    key = 'event-relations';
    if (this.thesauri && this.thesauri[key]) {
      this.relationEntries = this.thesauri[key].entries;
    } else {
      this.relationEntries = undefined;
    }
    key = 'chronotope-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.ctTagEntries = this.thesauri[key].entries;
    } else {
      this.ctTagEntries = undefined;
    }
    key = 'assertion-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.assTagEntries = this.thesauri[key].entries;
    } else {
      this.assTagEntries = undefined;
    }
    key = 'doc-reference-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.refTagEntries = this.thesauri[key].entries;
    } else {
      this.refTagEntries = undefined;
    }
    key = 'doc-reference-types';
    if (this.thesauri && this.thesauri[key]) {
      this.refTypeEntries = this.thesauri[key].entries;
    } else {
      this.refTypeEntries = undefined;
    }
  }

  protected getModelFromForm(): HistoricalEventsPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId || '',
        id: '',
        typeId: HISTORICAL_EVENTS_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        events: [],
      };
    }
    part.events = this.events.value || [];
    return part;
  }

  public addEvent(): void {
    const ev: HistoricalEvent = {
      eid: '',
      type: this.eventTypeEntries?.length ? this.eventTypeEntries[0].id : '',
    };
    this.events.setValue([...this.events.value, ev]);
    this.editEvent(this.events.value.length - 1);
  }

  public editEvent(index: number): void {
    if (index < 0) {
      this._editedIndex = -1;
      this.tabIndex = 0;
      this.editedEvent = undefined;
    } else {
      this._editedIndex = index;
      this.editedEvent = this.events.value[index];
      setTimeout(() => {
        this.tabIndex = 1;
      }, 300);
    }
  }

  public onEventSave(entry: HistoricalEvent): void {
    this.events.setValue(
      this.events.value.map((e: HistoricalEvent, i: number) =>
        i === this._editedIndex ? entry : e
      )
    );
    this.editEvent(-1);
  }

  public onEventClose(): void {
    this.editEvent(-1);
  }

  public deleteEvent(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete entry?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const entries = [...this.events.value];
          entries.splice(index, 1);
          this.events.setValue(entries);
        }
      });
  }

  public moveEventUp(index: number): void {
    if (index < 1) {
      return;
    }
    const entry = this.events.value[index];
    const entries = [...this.events.value];
    entries.splice(index, 1);
    entries.splice(index - 1, 0, entry);
    this.events.setValue(entries);
  }

  public moveEventDown(index: number): void {
    if (index + 1 >= this.events.value.length) {
      return;
    }
    const entry = this.events.value[index];
    const entries = [...this.events.value];
    entries.splice(index, 1);
    entries.splice(index + 1, 0, entry);
    this.events.setValue(entries);
  }
}
