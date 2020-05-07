import {NgModule} from '@angular/core';

import 'hammerjs';

import {
  MatAutocompleteModule, MatBadgeModule,
  MatButtonModule, MatCardModule, MatCheckboxModule,
  MatDialogModule, MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSidenavModule, MatSnackBarModule, MatSortModule,
  MatTableModule, MatTabsModule,
  MatToolbarModule, MatSelectModule
} from '@angular/material';
import { MaterialFileInputModule } from 'ngx-material-file-input';

@NgModule({
  exports: [
    MatSidenavModule, MatButtonModule,
    MatIconModule, MatToolbarModule, MatMenuModule,
    MatDialogModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatDialogModule, MatSnackBarModule,
    MaterialFileInputModule, MatAutocompleteModule, MatExpansionModule,
    MatBadgeModule, MatTabsModule, MatCardModule, MatCheckboxModule,
    MatSortModule
  ]
})

export class MatModule { }

