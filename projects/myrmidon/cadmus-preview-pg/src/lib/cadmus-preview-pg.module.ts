import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Route } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';
import { NgToolsModule } from '@myrmidon/ng-tools';
import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusPreviewUiModule } from '@myrmidon/cadmus-preview-ui';

import { PartPreviewFeatureComponent } from './components/part-preview-feature/part-preview-feature.component';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  {
    path: ':iid/:pid',
    pathMatch: 'full',
    component: PartPreviewFeatureComponent,
  },
]);

@NgModule({
  declarations: [PartPreviewFeatureComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterModuleForChild,
    ReactiveFormsModule,
    // material
    MatCardModule,
    MatTabsModule,
    // cadmus
    NgToolsModule,
    NgMatToolsModule,
    CadmusApiModule,
    CadmusPreviewUiModule
  ],
  exports: [PartPreviewFeatureComponent],
})
export class CadmusPreviewPgModule {}
