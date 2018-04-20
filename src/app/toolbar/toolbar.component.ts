import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { MatSlideToggle } from '@angular/material';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {
  @Output() toolbarEvent = new EventEmitter<any>();
  @ViewChild(MatSlideToggle) answer:MatSlideToggle
  constructor() { 
    
  }
 
  ngOnInit() {
  }

  onMenu() {
    this.toolbarEvent.emit();
  }
}
