import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {
  @Output() toolbarEvent = new EventEmitter<any>();
  constructor() { 
    
  }
 
  ngOnInit() {
  }
  onMenu() {
    this.toolbarEvent.emit();
  }
}
