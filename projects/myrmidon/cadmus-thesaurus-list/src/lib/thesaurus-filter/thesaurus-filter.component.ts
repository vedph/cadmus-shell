import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { ThesaurusFilter } from '@myrmidon/cadmus-core';

@Component({
  selector: 'cadmus-thesaurus-filter',
  templateUrl: './thesaurus-filter.component.html',
  styleUrls: ['./thesaurus-filter.component.css'],
})
export class ThesaurusFilterComponent implements OnInit {
  @Input()
  public filter$?: BehaviorSubject<ThesaurusFilter>;

  public id: FormControl<string | null>;
  public alias: FormControl<boolean | null>;
  public language: FormControl<string | null>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.id = formBuilder.control('id');
    this.alias = formBuilder.control(null);
    this.language = formBuilder.control(
      null,
      Validators.pattern(/^[a-z]{2,3}$/g)
    );
    this.form = formBuilder.group({
      id: this.id,
      alias: this.alias,
      language: this.language,
    });
  }

  ngOnInit(): void {
    // update form when filter changes
    this.filter$?.subscribe((f) => {
      this.updateForm(f);
    });
  }

  private updateForm(filter: ThesaurusFilter): void {
    this.id.setValue(filter.id || null);
    this.alias.setValue(filter.isAlias || null);
    this.language.setValue(filter.language || null);
    this.form.markAsPristine();
  }

  private getFilter(): ThesaurusFilter {
    return {
      pageNumber: 0,
      pageSize: 0,
      id: this.id.value || undefined,
      isAlias: this.alias.value || undefined,
      language: this.language.value || undefined,
    };
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
    this.filter$?.next(filter);
  }
}
