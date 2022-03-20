import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GraphService, NodeResult, TripleResult } from '@myrmidon/cadmus-api';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'cadmus-graph-triple-editor',
  templateUrl: './graph-triple-editor.component.html',
  styleUrls: ['./graph-triple-editor.component.css'],
})
export class GraphTripleEditorComponent implements OnInit {
  private _triple: TripleResult | undefined;
  private _nodeS?: NodeResult;
  private _nodeP?: NodeResult;
  private _nodeO?: NodeResult;

  @Input()
  public get triple(): TripleResult | undefined {
    return this._triple;
  }
  public set triple(value: TripleResult | undefined) {
    this._triple = value;
    this.updateForm();
  }

  /**
   * The optional set of thesaurus entries for triple's tags.
   */
  @Input()
  public tagEntries?: ThesaurusEntry[] | undefined;

  /**
   * Emitted when triple has changed.
   */
  @Output()
  public tripleChange: EventEmitter<TripleResult>;

  /**
   * Emitted when the user requested to close the editor.
   */
  @Output()
  public editorClose: EventEmitter<any>;

  public isNew: boolean;

  public subjectNode: FormControl;
  public predicateNode: FormControl;
  public objectNode: FormControl;
  public literal: FormControl;
  public tag: FormControl;
  public form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private _snackbar: MatSnackBar,
    private _graphService: GraphService
  ) {
    this.tripleChange = new EventEmitter<TripleResult>();
    this.editorClose = new EventEmitter<any>();
    this.isNew = true;
    // form
    this.subjectNode = formBuilder.control(null, Validators.required);
    this.predicateNode = formBuilder.control(null, Validators.required);
    this.objectNode = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(15000),
    ]);
    this.literal = formBuilder.control(true);
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.form = formBuilder.group({
      subjectNode: this.subjectNode,
      predicateNode: this.predicateNode,
      objectNode: this.objectNode,
      literal: this.literal,
      tag: this.tag,
    });
  }

  ngOnInit(): void {}

  public onSubjectChange(node?: NodeResult | null): void {
    this.subjectNode.setValue(node?.uri ?? undefined);
    this.subjectNode.updateValueAndValidity();
    this.subjectNode.markAsDirty();
  }

  public onPredicateChange(node?: NodeResult | null): void {
    this.predicateNode.setValue(node?.uri ?? undefined);
    this.predicateNode.updateValueAndValidity();
    this.predicateNode.markAsDirty();
  }

  public onObjectChange(node?: NodeResult | null): void {
    this.objectNode.setValue(node?.uri ?? undefined);
    this.objectNode.updateValueAndValidity();
    this.objectNode.markAsDirty();

    this.literal.setValue(false);
    this.literal.updateValueAndValidity();
    this.literal.markAsDirty();
  }

  private getNode(id: number): Promise<NodeResult | undefined> {
    return new Promise((resolve, reject) => {
      this._graphService
        .getNode(id)
        .pipe(take(1))
        .subscribe({
          next: (node) => {
            resolve(node);
          },
          error: (error) => {
            if (error) {
              console.error(JSON.stringify(error));
            }
            this._snackbar.open('Error loading node ' + id, 'OK');
            reject();
          },
        });
    });
  }

  private updateForm(triple?: TripleResult): void {
    if (!triple) {
      this.form.reset();
      this.isNew = true;
      return;
    }
    if (triple.subjectId) {
      this.getNode(triple.subjectId).then((node) => {
        this._nodeS = node;
        this.subjectNode.setValue(node?.uri || triple.subjectUri);
        this.subjectNode.updateValueAndValidity();
        this.subjectNode.markAsDirty();
      });
    } else {
      this.subjectNode.reset();
    }
    if (triple.predicateId) {
      this.getNode(triple.predicateId).then((node) => {
        this._nodeP = node;
        this.predicateNode.setValue(node?.uri || triple.predicateUri);
        this.predicateNode.updateValueAndValidity();
        this.predicateNode.markAsDirty();
      });
    } else {
      this.predicateNode.reset();
    }
    if (triple.objectId) {
      this.literal.setValue(false);
      this.getNode(triple.objectId).then((node) => {
        this._nodeO = node;
        this.objectNode.setValue(node?.uri || triple.objectUri);
        this.objectNode.updateValueAndValidity();
        this.objectNode.markAsDirty();
      });
    } else {
      this.literal.setValue(true);
      this.objectNode.setValue(triple.objectLiteral);
    }
    this.isNew = triple.id ? false : true;
    this.form.markAsPristine();
  }

  private getTriple(): TripleResult {
    return {
      id: this.triple?.id || 0,
      subjectId: this._nodeS?.id || 0,
      predicateId: this._nodeP?.id || 0,
      objectId: this._nodeO?.id || 0,
      objectLiteral: this.literal.value ? this.objectNode.value : undefined,
      subjectUri: this._nodeS?.uri || '',
      predicateUri: this._nodeP?.uri || '',
      objectUri: this.literal.value ? undefined : this._nodeO?.uri,
    };
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this.tripleChange.emit(this.getTriple());
  }
}
