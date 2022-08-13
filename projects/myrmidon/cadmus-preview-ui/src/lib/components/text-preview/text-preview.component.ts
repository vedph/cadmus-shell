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
import {
  TextBlock,
  TextBlockEventArgs,
} from '@myrmidon/cadmus-text-block-view';

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
    this.loadItem();
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
  public selectedLayer: FormControl<LayerPartInfo | null>;
  public frHtml?: string;

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

  ngOnInit(): void {
    this.selectedLayer.valueChanges.subscribe((_) => {
      if (!this.busy) {
        this.loadLayer();
      }
    });
    this.loadItem();
  }

  private getLayerTypeId(layer: LayerPartInfo): string | null {
    if (!layer) {
      return null;
    }
    let id = layer.typeId;
    if (layer.roleId) {
      id += '|' + layer.roleId;
    }
    return id;
  }

  private adjustBlockWS(blocks: TextBlock[]): void {
    const head = /^\s+/;
    const tail = /\s+$/;
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].text = blocks[i].text.replace(head, '\xa0');
      blocks[i].text = blocks[i].text.replace(tail, '\xa0');
    }
  }

  private loadLayer(): void {
    const layer = this.selectedLayer.value;
    const layers = layer ? [layer] : [];
    this.busy = true;

    this._previewService
      .getTextBlocks(
        this._source!.partId,
        layers.map((l) => l.id),
        layers.map((l) => this.getLayerTypeId(l))
      )
      .pipe(take(1))
      .subscribe({
        next: (rows) => {
          this.busy = false;
          // convert initial/final WS into nbsp
          for (let i = 0; i < rows.length; i++) {
            this.adjustBlockWS(rows[i].blocks);
          }
          this.rows = rows;
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
  }

  private loadItem(): void {
    if (this.busy) {
      return;
    }
    if (!this._source?.partId) {
      this.item = undefined;
      this.layers = [];
      this.rows = [];
      return;
    }
    forkJoin({
      item: this._itemService.getItem(this._source!.itemId, false),
      layers: this._itemService.getItemLayerInfo(this._source.itemId, false),
    })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.busy = false;
          this.item = result.item;
          this.layers = result.layers;
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
  }

  private showFragment(index: number): void {
    if (this.busy || !this.selectedLayer.value) {
      return;
    }
    this.busy = true;
    this._previewService
      .renderFragment(this.selectedLayer.value.id, index)
      .pipe(take(1))
      .subscribe({
        next: (r) => {
          this.busy = false;
          this.frHtml = r.result;
        },
        error: (error) => {
          this.busy = false;
          if (error) {
            console.error(JSON.stringify(error));
          }
          this._snackbar.open('Error previewing part ' + this._source!.partId);
        },
      });
  }

  public onBlockClick(args: TextBlockEventArgs): void {
    if (!args.block.layerIds?.length) {
      return;
    }
    const m = /[0-9]+$/.exec(args.block.layerIds[0]);
    if (!m?.length) {
      return;
    }
    this.showFragment(+m);

    // alert('Block ' + (args.decoration ? 'dec ' : '') + args.block.id);
  }
}
