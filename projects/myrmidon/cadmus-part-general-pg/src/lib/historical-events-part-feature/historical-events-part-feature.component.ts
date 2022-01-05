import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditHistoricalEventsPartQuery } from './edit-historical-events-part.query';
import { EditHistoricalEventsPartService } from './edit-historical-events-part.service';

@Component({
  selector: 'cadmus-historical-events-part-feature',
  templateUrl: './historical-events-part-feature.component.html',
  styleUrls: ['./historical-events-part-feature.component.css'],
})
export class HistoricalEventsPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditHistoricalEventsPartQuery,
    editPartService: EditHistoricalEventsPartService,
    editItemQuery: EditItemQuery,
    editItemService: EditItemService
  ) {
    super(
      router,
      route,
      snackbar,
      editPartQuery,
      editPartService,
      editItemQuery,
      editItemService
    );
  }

  public ngOnInit(): void {
    this.initEditor([
      'event-types',
      'event-relations',
      'chronotope-tags',
      'assertion-tags',
      'doc-reference-tags',
      'doc-reference-types',
    ]);
  }
}
