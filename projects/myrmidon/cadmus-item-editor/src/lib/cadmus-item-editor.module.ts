import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { NgToolsModule } from '@myrmidon/ng-tools';
import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusStateModule } from '@myrmidon/cadmus-state';

import { ItemEditorComponent } from './item-editor/item-editor.component';
import { PartsScopeEditorComponent } from './parts-scope-editor/parts-scope-editor.component';
import { MissingPartsComponent } from './missing-parts/missing-parts.component';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  { path: '', pathMatch: 'full', component: ItemEditorComponent },
]);

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModuleForChild,
    ClipboardModule,
    // material
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTabsModule,
    // cadmus
    CadmusCoreModule,
    CadmusApiModule,
    CadmusUiModule,
    CadmusStateModule,
    NgToolsModule,
    NgMatToolsModule,
  ],
  declarations: [
    ItemEditorComponent,
    MissingPartsComponent,
    PartsScopeEditorComponent,
  ],
  exports: [ItemEditorComponent],
})
export class CadmusItemEditorModule {}
