import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  PreviewService,
  ItemService,
  TextBlockRow,
} from '@myrmidon/cadmus-api';
import { Item, LayerPartInfo, ThesaurusEntry } from '@myrmidon/cadmus-core';

import { PartPreviewSource } from '../part-preview/part-preview.component';
import { FormBuilder, FormControl } from '@angular/forms';
import { TextBlockEventArgs } from '@myrmidon/cadmus-text-block-view';

/**
 * Layered text preview component.
 */
@Component({
  selector: 'cadmus-text-preview',
  templateUrl: './text-preview.component.html',
  styleUrls: ['./text-preview.component.css'],
})
export class TextPreviewComponent implements OnInit {
  private _source: PartPreviewSource | undefined | null;

  /**
   * The source of the part to be previewed.
   */
  @Input()
  public get source(): PartPreviewSource | undefined | null {
    return this._source;
  }
  public set source(value: PartPreviewSource | undefined | null) {
    this._source = value;
    this.refresh();
  }

  /**
   * The model types thesaurus entries.
   */
  @Input()
  public typeEntries: ThesaurusEntry[] | undefined | null;

  public busy?: boolean;
  public item?: Item;
  public layers: LayerPartInfo[];
  public rows: TextBlockRow[];
  public selectedLayer: FormControl<LayerPartInfo|null>;

  constructor(
    private _previewService: PreviewService,
    private _itemService: ItemService,
    private _snackbar: MatSnackBar,
    formBuilder: FormBuilder
  ) {
    this.layers = [];
    this.rows = [];
    // form
    this.selectedLayer = formBuilder.control(null);
  }

  ngOnInit(): void {}

  private getLayerTypeId(roleId: string): string {
    // a role ID like "fr.it.vedph.note" becomes "it_vedph_note__"
    // which is prefixed to the fragment index when building blocks
    return roleId.substring(3).replace('.', '_') + '__';
  }

  private refresh(): void {
    if (this.busy) {
      return;
    }
    if (!this._source?.partId) {
      this.item = undefined;
      this.layers = [];
      this.rows = [];
      return;
    }
    // load text part's layers info
    this.busy = true;
    this._itemService
      .getItemLayerInfo(this._source.itemId, false)
      .pipe(take(1))
      .subscribe({
        next: (layers) => {
          // once got layers, get item and rows of blocks merged with them
          this.layers = layers;
          forkJoin({
            item: this._itemService.getItem(this._source!.itemId, false),
            rows: this._previewService.getTextBlocks(
              this._source!.partId,
              layers.map((l) => l.id),
              layers.map((l) => this.getLayerTypeId(l.roleId!))
            ),
          })
            .pipe(take(1))
            .subscribe({
              next: (result) => {
                this.busy = false;
                this.item = result.item;
                this.rows = result.rows;
                // TODO optionally select layer
              },
              error: (error) => {
                this.busy = false;
                if (error) {
                  console.error(JSON.stringify(error));
                }
                this._snackbar.open(
                  'Error previewing text part ' + this._source!.partId
                );
              },
            });
        },
        error: (error) => {
          this.busy = false;
          if (error) {
            console.error(JSON.stringify(error));
          }
          this._snackbar.open(
            'Error getting layer info for item ' + this._source!.itemId
          );
        },
      });
  }

  public onBlockClick(args: TextBlockEventArgs): void {
    alert('Block ' + (args.decoration ? 'dec ' : '') + args.block.id);
  }
}
