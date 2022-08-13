import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { PartPreviewSource } from '@myrmidon/cadmus-preview-ui';
import { AppQuery } from '@myrmidon/cadmus-state';

@Component({
  selector: 'cadmus-text-preview-feature',
  templateUrl: './text-preview-feature.component.html',
  styleUrls: ['./text-preview-feature.component.css'],
})
export class TextPreviewFeatureComponent implements OnInit {
  public source?: PartPreviewSource;
  public typeEntries?: ThesaurusEntry[];

  constructor(route: ActivatedRoute, appQuery: AppQuery) {
    this.source = {
      itemId: route.snapshot.params['iid'],
      partId: route.snapshot.params['pid'],
    };
    appQuery
      .selectTypeThesaurus()
      .pipe(take(1))
      .subscribe((t) => {
        this.typeEntries = t?.entries;
      });
  }

  ngOnInit(): void {}
}
