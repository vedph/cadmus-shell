import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditChronotopesPartQuery } from './edit-chronotopes-part.query';
import { EditChronotopesPartService } from './edit-chronotopes-part.service';

@Component({
  selector: 'cadmus-chronotopes-part-feature',
  templateUrl: './chronotopes-part-feature.component.html',
  styleUrls: ['./chronotopes-part-feature.component.css'],
})
export class ChronotopesPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditChronotopesPartQuery,
    editPartService: EditChronotopesPartService,
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
      'chronotope-place-tags',
      'chronotope-assertion-tags',
      'doc-reference-types',
      'doc-reference-tags',
    ]);
  }
}
