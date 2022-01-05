import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { AssertedChronotope } from '@myrmidon/cadmus-refs-asserted-chronotope';
import { Assertion } from '@myrmidon/cadmus-refs-assertion';
import { HistoricalEvent, RelatedEntity } from '../historical-events-part';

@Component({
  selector: 'cadmus-historical-event-editor',
  templateUrl: './historical-event-editor.component.html',
  styleUrls: ['./historical-event-editor.component.css'],
})
export class HistoricalEventEditorComponent implements OnInit {
  private _model: HistoricalEvent | undefined;
  private _currentEntityIndex: number;

  @Input()
  public get model(): HistoricalEvent | undefined {
    return this._model;
  }
  public set model(value: HistoricalEvent | undefined) {
    this._model = value;
    this.updateForm(value);
  }

  /**
   * Thesaurus event-types.
   */
  @Input()
  public eventTypeEntries: ThesaurusEntry[] | undefined;
  /**
   * Thesaurus event-relations.
   */
  @Input()
  public relationEntries: ThesaurusEntry[] | undefined;
  /**
   * Thesaurus chronotope-tags.
   */
  @Input()
  public ctTagEntries: ThesaurusEntry[] | undefined;
  /**
   * Thesaurus assertion-tags.
   */
  @Input()
  public assTagEntries: ThesaurusEntry[] | undefined;
  /**
   * Thesaurus doc-reference-tags.
   */
  @Input()
  public refTagEntries: ThesaurusEntry[] | undefined;
  /**
   * Thesaurus doc-reference-types.
   */
  @Input()
  public refTypeEntries: ThesaurusEntry[] | undefined;

  @Output()
  public modelChange: EventEmitter<HistoricalEvent>;
  @Output()
  public editorClose: EventEmitter<any>;

  // event
  public eid: FormControl;
  public type: FormControl;
  public description: FormControl;
  public note: FormControl;
  public form: FormGroup;
  public relatedEntities: RelatedEntity[];
  public initialChronotope?: AssertedChronotope;
  public chronotope?: AssertedChronotope;
  public initialAssertion?: Assertion;
  public assertion?: Assertion;

  // related entity
  public currentEntity?: RelatedEntity;
  public relation: FormControl;
  public id: FormControl;
  public reForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.modelChange = new EventEmitter<HistoricalEvent>();
    this.editorClose = new EventEmitter<any>();
    this.relatedEntities = [];
    this._currentEntityIndex = -1;
    // form
    this.eid = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);
    this.type = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);
    this.description = formBuilder.control(null, Validators.maxLength(1000));
    this.note = formBuilder.control(Validators.maxLength(1000));
    this.form = formBuilder.group({
      eid: this.eid,
      type: this.type,
      description: this.description,
      note: this.note,
    });
    // related entity
    this.relation = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);
    this.id = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);
    this.reForm = formBuilder.group({
      relation: this.relation,
      id: this.id,
    });
  }

  ngOnInit(): void {
    if (this._model) {
      this.updateForm(this._model);
    }
  }

  private updateForm(model: HistoricalEvent | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.eid.setValue(model.eid);
    this.type.setValue(model.type);
    this.description.setValue(model.description);
    this.note.setValue(model.note);
    this.initialChronotope = model.chronotope;
    this.initialAssertion = model.assertion;
    this.relatedEntities = model.relatedEntities || [];
    this.form.markAsPristine();
  }

  private getModel(): HistoricalEvent | null {
    return {
      eid: this.eid.value?.trim(),
      type: this.type.value?.trim(),
      description: this.description.value?.trim() || undefined,
      note: this.note.value?.trim() || undefined,
      chronotope: this.chronotope,
      assertion: this.assertion,
      relatedEntities: this.relatedEntities,
    };
  }

  public onChronotopeChange(chronotope: AssertedChronotope): void {
    this.chronotope = chronotope;
  }

  public onAssertionChange(assertion: Assertion | undefined): void {
    this.assertion = assertion;
  }

  public newCurrentEntity(): void {
    this.setCurrentEntity({
      id: '',
      relation: this.relationEntries?.length ? this.relationEntries[0].id : '',
    });
  }

  public setCurrentEntity(entity: RelatedEntity | undefined): void {
    this.currentEntity = entity;
    if (!entity) {
      this._currentEntityIndex = -1;
      this.reForm.reset();
    } else {
      this._currentEntityIndex = this.relatedEntities.indexOf(entity);
      this.relation.setValue(entity.relation);
      this.id.setValue(entity.id);
      this.reForm.markAsPristine();
    }
  }

  public saveCurrentEntity(): void {
    if (!this.currentEntity || this.reForm.invalid) {
      return;
    }
    const entity: RelatedEntity = {
      id: this.id.value.trim(),
      relation: this.relation.value.trim(),
    };
    if (
      this.relatedEntities.find(
        (e) => e.id === entity.id && e.relation === e.relation
      )
    ) {
      this.setCurrentEntity(undefined);
      return;
    }
    if (this._currentEntityIndex > -1) {
      this.relatedEntities.splice(this._currentEntityIndex, 1, entity);
    } else {
      this.relatedEntities.push(entity);
    }
    this.setCurrentEntity(undefined);
  }

  public deleteRelatedEntity(entity: RelatedEntity): void {
    if (this.currentEntity?.id === entity.id) {
      this.setCurrentEntity(undefined);
    }
    const i = this.relatedEntities.findIndex((e) => e.id === entity.id);
    if (i > -1) {
      this.relatedEntities.splice(i, 1);
    }
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    const model = this.getModel();
    if (!model) {
      return;
    }
    this.modelChange.emit(model);
  }
}
