import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditNamesPartQuery } from './edit-names-part.query';
import { EditNamesPartService } from './edit-names-part.service';

@Component({
  selector: 'cadmus-names-part-feature',
  templateUrl: './names-part-feature.component.html',
  styleUrls: ['./names-part-feature.component.css'],
})
export class NamesPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditNamesPartQuery,
    editPartService: EditNamesPartService,
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
      'name-languages',
      'name-tags',
      'name-piece-types',
      'assertion-tags',
      'assertion-ref-types',
      'assertion-ref-tags',
    ]);
  }
}
