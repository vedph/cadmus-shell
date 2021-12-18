import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

// Monaco
import { MonacoEditorModule } from 'ngx-monaco-editor';

// Cadmus
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { NgToolsModule } from '@myrmidon/ng-tools';

import { CloseSaveButtonsComponent } from './components/close-save-buttons/close-save-buttons.component';
import { ErrorListComponent } from './components/error-list/error-list.component';
import { FacetBadgeComponent } from './components/facet-badge/facet-badge.component';
import { FlagsBadgeComponent } from './components/flags-badge/flags-badge.component';
import { DecoratedTokenTextComponent } from './components/decorated-token-text/decorated-token-text.component';
import { LayerHintsComponent } from './components/layer-hints/layer-hints.component';
import { LookupPinComponent } from './components/lookup-pin/lookup-pin.component';
import { MultiEntrySelectorComponent } from './components/multi-entry-selector/multi-entry-selector.component';
import { PartBadgeComponent } from './components/part-badge/part-badge.component';
import { PhysicalDimensionComponent } from './components/physical-dimension/physical-dimension.component';
import { PhysicalSizeComponent } from './components/physical-size/physical-size.component';
import { ThesaurusTreeComponent } from './components/thesaurus-tree/thesaurus-tree.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    // material
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTreeModule,
    MatTooltipModule,
    // monaco
    MonacoEditorModule,
    // cadmus
    NgToolsModule,
    CadmusCoreModule,
  ],
  declarations: [
    CloseSaveButtonsComponent,
    DecoratedTokenTextComponent,
    ErrorListComponent,
    FacetBadgeComponent,
    FlagsBadgeComponent,
    LayerHintsComponent,
    LookupPinComponent,
    MultiEntrySelectorComponent,
    PartBadgeComponent,
    PhysicalDimensionComponent,
    PhysicalSizeComponent,
    ThesaurusTreeComponent,
  ],
  exports: [
    CloseSaveButtonsComponent,
    DecoratedTokenTextComponent,
    ErrorListComponent,
    FacetBadgeComponent,
    FlagsBadgeComponent,
    LayerHintsComponent,
    LookupPinComponent,
    MultiEntrySelectorComponent,
    PartBadgeComponent,
    PhysicalDimensionComponent,
    PhysicalSizeComponent,
    ThesaurusTreeComponent,
  ],
})
export class CadmusUiModule {}
