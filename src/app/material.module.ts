import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule,
    MatCardModule, MatMenuModule, MatTooltipModule,
    MatDialogModule, MatChipsModule, MatAutocompleteModule, MatFormFieldModule,
    MatInputModule, MatSnackBarModule, MatSlideToggleModule, MatExpansionModule, 
    MatListModule, MatSelectModule
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
        MatSelectModule],
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
        MatSelectModule]
})

export class MaterialModule {}