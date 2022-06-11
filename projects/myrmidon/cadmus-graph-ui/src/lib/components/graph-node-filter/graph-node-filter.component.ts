import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { NodeFilter, NodeResult } from '@myrmidon/cadmus-api';

import { GraphNodesQuery } from '../../state/graph-nodes.query';
import { GraphNodesService } from '../../state/graph-nodes.service';

/**
 * Graph nodes filter used in graph nodes list.
 * Its data are in the graph nodes store, which gets updated when
 * users apply new filters.
 */
@Component({
  selector: 'cadmus-graph-node-filter',
  templateUrl: './graph-node-filter.component.html',
  styleUrls: ['./graph-node-filter.component.css'],
})
export class GraphNodeFilterComponent implements OnInit {
  public filter$: Observable<NodeFilter>;
  public linkedNode$: Observable<NodeResult | undefined>;
  public classNodes$: Observable<NodeResult[] | undefined>;

  @Input()
  public disabled?: boolean;

  public label: FormControl<string | null>;
  public isClass: FormControl<number>;
  public uid: FormControl<string | null>;
  public tag: FormControl<string | null>;
  public sourceType: FormControl<number | null>;
  public sid: FormControl<string | null>;
  public sidPrefix: FormControl<boolean>;
  public linkedNodeRole: FormControl<'S' | 'O' | null>;
  public form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private _query: GraphNodesQuery,
    private _nodesService: GraphNodesService
  ) {
    this.filter$ = _query.selectFilter();
    this.linkedNode$ = _query.selectLinkedNode();
    this.classNodes$ = _query.selectClassNodes();
    // form
    this.label = formBuilder.control(null);
    this.isClass = formBuilder.control(0, { nonNullable: true });
    this.uid = formBuilder.control(null);
    this.tag = formBuilder.control(null);
    this.sourceType = formBuilder.control(null);
    this.sid = formBuilder.control(null);
    this.sidPrefix = formBuilder.control(false, { nonNullable: true });
    this.linkedNodeRole = formBuilder.control(null);
    this.form = formBuilder.group({
      label: this.label,
      isClass: this.isClass,
      uid: this.uid,
      tag: this.tag,
      sourceType: this.sourceType,
      sid: this.sid,
      sidPrefix: this.sidPrefix,
      linkedNodeRole: this.linkedNodeRole,
    });
  }

  ngOnInit(): void {
    this.filter$.subscribe((f) => {
      this.updateForm(f);
    });
  }

  private updateForm(filter: NodeFilter): void {
    this.label.setValue(filter.label || null);
    // is-class: 0=unset, 1=class, 2=not-class
    if (filter.isClass !== undefined && filter.isClass !== null) {
      this.isClass.setValue(filter.isClass ? 1 : 2);
    } else {
      this.isClass.setValue(0);
    }
    this.uid.setValue(filter.uid || null);
    this.tag.setValue(filter.tag || null);
    if (filter.sourceType === undefined || filter.sourceType === null) {
      this.sourceType.setValue(null);
    } else {
      this.sourceType.setValue(filter.sourceType);
    }
    this.sid.setValue(filter.sid || null);
    this.sidPrefix.setValue(filter.isSidPrefix ? true : false);
    this._nodesService.setLinkedNodeId(filter.linkedNodeId);
    this.linkedNodeRole.setValue(filter.linkedNodeRole || 'S');
    this._nodesService.setClassNodeIds(filter.classIds);
    this.form.markAsPristine();
  }

  private getFilter(): NodeFilter {
    return {
      pageNumber: 1, // not used
      pageSize: 20, // not used
      label: this.label.value?.trim(),
      isClass: this.isClass.value === 0 ? undefined : this.isClass.value === 1,
      uid: this.uid.value?.trim(),
      tag: this.tag.value?.trim(),
      sourceType:
        this.sourceType.value === null ? undefined : this.sourceType.value,
      sid: this.sid.value?.trim(),
      isSidPrefix: this.sidPrefix.value,
      linkedNodeId: this._query.getLinkedNode()?.id,
      linkedNodeRole: this.linkedNodeRole.value,
      classIds: this._query.getClassNodes()?.map((n) => n.id),
    };
  }

  public onResetLinkedNode(): void {
    this._nodesService.setLinkedNode(null);
  }

  public onLinkedNodeSet(node: NodeResult | null): void {
    this._nodesService.setLinkedNode(node);
  }

  public onClassAdd(node: NodeResult | null): void {
    if (!node) {
      return;
    }
    this._nodesService.addClassNode(node);
  }

  public onClassRemove(id: number): void {
    this._nodesService.removeClassNode(id);
  }

  public reset(): void {
    this.form.reset();
    this.apply();
  }

  public apply(): void {
    if (this.form.invalid) {
      return;
    }
    const filter = this.getFilter();

    // update filter in state
    this._nodesService.updateFilter(filter);
  }
}
