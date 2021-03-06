import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  EditItemQuery,
  EditItemService,
  EditLayerPartQuery,
  EditLayerPartService,
  EditFragmentFeatureBase,
} from '@myrmidon/cadmus-state';
import { LibraryRouteService } from '@myrmidon/cadmus-core';

import { EditWitnessesFragmentQuery } from './edit-witnesses-fragment.query';
import { EditWitnessesFragmentService } from './edit-witnesses-fragment.service';

@Component({
  selector: 'cadmus-witnesses-fragment-feature',
  templateUrl: './witnesses-fragment-feature.component.html',
  styleUrls: ['./witnesses-fragment-feature.component.css'],
})
export class WitnessesFragmentFeatureComponent
  extends EditFragmentFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editFrQuery: EditWitnessesFragmentQuery,
    editFrService: EditWitnessesFragmentService,
    editItemQuery: EditItemQuery,
    editItemService: EditItemService,
    editLayersQuery: EditLayerPartQuery,
    editLayersService: EditLayerPartService,
    libraryRouteService: LibraryRouteService
  ) {
    super(
      router,
      route,
      snackbar,
      editFrQuery,
      editFrService,
      editItemQuery,
      editItemService,
      editLayersQuery,
      editLayersService,
      libraryRouteService
    );
  }

  ngOnInit() {
    this.initEditor();
  }
}
