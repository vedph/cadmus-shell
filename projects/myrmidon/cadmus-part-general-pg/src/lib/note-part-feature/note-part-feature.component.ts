import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditNotePartService } from './edit-note-part.service';
import { EditNotePartQuery } from './edit-note-part.query';

@Component({
  selector: 'cadmus-note-part-feature',
  templateUrl: './note-part-feature.component.html',
  styleUrls: ['./note-part-feature.component.css'],
})
export class NotePartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditNotePartQuery,
    editPartService: EditNotePartService,
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
    this.initEditor(['note-tags']);
  }
}
