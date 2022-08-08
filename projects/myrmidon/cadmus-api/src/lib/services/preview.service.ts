import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { ErrorService, EnvService } from '@myrmidon/ng-tools';

/**
 * Result of an object rendition.
 */
export interface RenditionResult {
  result: string;
}

/**
 * A text block used in bricks. This interface is repeated here
 * to avoid adding a dependency from bricks.
 */
export interface TextBlock {
  id: string;
  text: string;
  decoration?: string;
  htmlDecoration?: string;
  tip?: string;
  layerIds: string[];
}

/**
 * A row of text blocks.
 */
export interface TextBlockRow {
  blocks: TextBlock[];
}

/**
 * Cadmus preview API service.
 */
@Injectable({
  providedIn: 'root',
})
export class PreviewService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  // preview/keys
  /**
   * Gets all the Cadmus objects keys registered for preview.
   *
   * @param flatteners If set to true, get keys for text flatteners.
   * If false, get keys for JSON renderers.
   * @returns List of unique keys.
   */
  public getKeys(flatteners: boolean): Observable<string[]> {
    const url = this._env.get('apiUrl') + 'preview/keys';
    let httpParams = new HttpParams();
    httpParams = httpParams.set('flatteners', flatteners);
    return this._http
      .get<string[]>(url, {
        params: httpParams,
      })
      .pipe(retry(3), catchError(this._error.handleError));
  }

  // preview/parts/{id}
  /**
   * Render the part with the specified ID.
   *
   * @param id The part's ID.
   * @returns Rendition.
   */
  public renderPart(id: string): Observable<RenditionResult> {
    return this._http
      .get<RenditionResult>(this._env.get('apiUrl') + `preview/parts/${id}`)
      .pipe(retry(3), catchError(this._error.handleError));
  }

  // preview/parts/{id}/{frIndex}
  /**
   * Render the fragment at the specified index in the part with the specified
   * ID.
   *
   * @param id The part's ID.
   * @param frIndex The fragment's index (0-N).
   * @returns Rendition.
   */
  public renderFragment(
    id: string,
    frIndex: number
  ): Observable<RenditionResult> {
    return this._http
      .get<RenditionResult>(
        this._env.get('apiUrl') + `preview/parts/${id}/${frIndex}`
      )
      .pipe(retry(3), catchError(this._error.handleError));
  }

  // preview/text-parts/{id}
  /**
   * Gets the text blocks built by flattening the text part with the
   * specified ID with all the layers specified.
   *
   * @param id The base text part's ID.
   * @param layerIds The layer parts IDs.
   */
  public getTextBlocks(
    id: string,
    layerIds: string[]
  ): Observable<TextBlockRow[]> {
    return this._http
      .get<TextBlockRow[]>(this._env.get('apiUrl') + `preview/text-parts/${id}`)
      .pipe(retry(3), catchError(this._error.handleError));
  }
}
