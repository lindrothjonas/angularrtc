import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule,
    MatCardModule, MatMenuModule, MatTooltipModule,
    MatDialogModule, MatChipsModule, MatAutocompleteModule, MatFormFieldModule,
    MatInputModule, MatSnackBarModule, MatSlideToggleModule, MatExpansionModule, 
    MatListModule, MatSelectModule, MatGridListModule
  } from '@angular/material';

@NgModule ({
    imports: [MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatMenuModule,
        MatTooltipModule,
        MatDialogModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatListModule,
        MatSelectModule,
        MatGridListModule],
    exports: [MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatMenuModule,
        MatTooltipModule,
        MatDialogModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatListModule,
        MatSelectModule,
        MatGridListModule]
})

export class MaterialModule {}