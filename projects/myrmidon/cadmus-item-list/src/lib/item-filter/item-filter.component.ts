import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

import { FlagMatching, ItemFilter } from '@myrmidon/cadmus-core';

import { ItemsLookupService } from '../services/items-lookup.service';
import { ItemsLookupQuery } from '../state/items-lookup.query';
import { ItemsLookupState } from '../state/items-lookup.store';

/**
 * Items filter.
 */
@Component({
  selector: 'cadmus-item-filter',
  templateUrl: './item-filter.component.html',
  styleUrls: ['./item-filter.component.css'],
})
export class ItemFilterComponent implements OnInit {
  @Input()
  public filter$?: BehaviorSubject<ItemFilter>;

  public title: FormControl<string | null>;
  public description: FormControl<string | null>;
  public facet: FormControl<string | null>;
  public group: FormControl<string | null>;
  public flagMatching: FormControl<FlagMatching>;
  public flags: FormControl<number[] | null>;
  public minModified: FormControl<Date | null>;
  public maxModified: FormControl<Date | null>;
  public user: FormControl<string | null>;
  public form: FormGroup;

  public lookup$: Observable<ItemsLookupState>;

  constructor(
    private _itemsLookupService: ItemsLookupService,
    private _itemsLookupQuery: ItemsLookupQuery,
    formBuilder: FormBuilder
  ) {
    this.title = formBuilder.control(null);
    this.description = formBuilder.control(null);
    this.facet = formBuilder.control(null);
    this.group = formBuilder.control(null);
    this.flags = formBuilder.control(null);
    this.flagMatching = formBuilder.control(FlagMatching.none, {
      nonNullable: true,
    });
    this.minModified = formBuilder.control(null);
    this.maxModified = formBuilder.control(null);
    this.user = formBuilder.control(null);

    this.form = formBuilder.group({
      title: this.title,
      description: this.description,
      facet: this.facet,
      group: this.group,
      flags: this.flags,
      flagMatching: this.flagMatching,
      minModified: this.minModified,
      maxModified: this.maxModified,
      user: this.user,
    });
    // subscribe to lookup data
    this.lookup$ = this._itemsLookupQuery.select();
  }

  ngOnInit() {
    // update form when filter changes
    this.filter$?.subscribe((f) => {
      this.updateForm(f);
    });

    // lookup
    this._itemsLookupService.load();
  }

  private flagsToArray(flags: number | undefined): number[] {
    if (!flags) {
      return [];
    }
    const a = [];
    let n = 1;
    for (let i = 0; i < 32; i++) {
      if ((flags & n) === n) {
        a.push(n);
      }
      n <<= 1;
    }
    return a;
  }

  private arrayToFlags(ids?: number[] | null): number | undefined {
    if (!ids) {
      return undefined;
    }
    let flags = 0;
    for (let i = 0; i < ids.length; i++) {
      flags |= ids[i];
    }
    return flags;
  }

  private updateForm(filter: ItemFilter) {
    this.title.setValue(filter.title || null);
    this.description.setValue(filter.description || null);
    this.facet.setValue(filter.facetId || null);
    this.group.setValue(filter.groupId || null);
    this.flags.setValue(this.flagsToArray(filter.flags));
    this.flagMatching.setValue(filter.flagMatching || FlagMatching.none);
    this.minModified.setValue(filter.minModified || null);
    this.maxModified.setValue(filter.maxModified || null);
    this.form.markAsPristine();
  }

  private getFilter(): ItemFilter {
    return {
      pageNumber: 0,
      pageSize: 0,
      title: this.title.value || undefined,
      description: this.description.value || undefined,
      facetId: this.facet.value || undefined,
      groupId: this.group.value || undefined,
      flags: this.arrayToFlags(this.flags.value),
      flagMatching: this.flagMatching.value,
      userId: this.user.value ? this.user.value : undefined,
      minModified: this.minModified.value ? this.minModified.value : undefined,
      maxModified: this.maxModified.value ? this.maxModified.value : undefined,
    };
  }

  public reset() {
    this.form.reset();
    this.apply();
  }

  public apply() {
    if (this.form.invalid) {
      return;
    }
    const filter = this.getFilter();
    this.filter$?.next(filter);
  }
}
