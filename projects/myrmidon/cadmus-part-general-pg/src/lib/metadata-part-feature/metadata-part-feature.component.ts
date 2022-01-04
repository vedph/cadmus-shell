import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditMetadataPartQuery } from './edit-metadata-part.query';
import { EditMetadataPartService } from './edit-metadata-part.service';

@Component({
  selector: 'cadmus-metadata-part-feature',
  templateUrl: './metadata-part-feature.component.html',
  styleUrls: ['./metadata-part-feature.component.css'],
})
export class MetadataPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditMetadataPartQuery,
    editPartService: EditMetadataPartService,
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
    this.initEditor(['metadata-types']);
  }
}
