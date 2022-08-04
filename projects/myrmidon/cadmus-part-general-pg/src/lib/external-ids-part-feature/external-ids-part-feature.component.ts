import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditExternalIdsPartService } from './edit-external-ids-part.service';
import { EditExternalIdsPartQuery } from './edit-external-ids-part.query';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'cadmus-refs-external-ids-part-feature',
  templateUrl: './external-ids-part-feature.component.html',
  styleUrls: ['./external-ids-part-feature.component.css'],
})
export class ExternalIdsPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditExternalIdsPartQuery,
    editPartService: EditExternalIdsPartService,
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
      'external-id-scopes',
      'external-id-tags',
      'assertion-tags',
      'doc-reference-types',
      'doc-reference-tags'
    ]);
  }
}
