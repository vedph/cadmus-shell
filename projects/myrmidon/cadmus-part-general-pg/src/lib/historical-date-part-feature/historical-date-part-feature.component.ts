import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  EditPartFeatureBase,
  EditItemQuery,
  EditItemService,
} from '@myrmidon/cadmus-state';

import { EditHistoricalDatePartQuery } from './edit-historical-date-part.query';
import { EditHistoricalDatePartService } from './edit-historical-date-part.service';

@Component({
  selector: 'cadmus-historical-date-part-feature',
  templateUrl: './historical-date-part-feature.component.html',
  styleUrls: ['./historical-date-part-feature.component.css'],
})
export class HistoricalDatePartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditHistoricalDatePartQuery,
    editPartService: EditHistoricalDatePartService,
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

  ngOnInit(): void {
    this.initEditor(['doc-reference-tags', 'doc-reference-types']);
  }
}
