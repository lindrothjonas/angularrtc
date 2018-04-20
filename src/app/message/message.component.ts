import { Component, OnInit, HostBinding, ViewEncapsulation, Input, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessageComponent implements OnInit {
  @HostBinding('class.message-opened')
  @Input() opened = false;
  @Input() outgoing = true;
  @Input() avatar = '';
  @Input() destination = '';
  @Input() subject = '';
  @Input() body = '';
  @Input() recieved = new Date();
  @Input() id = '';
  @Output() removed = new EventEmitter<String>();
  @Output() call = new EventEmitter<String>();

  onOpenToggle(): void {
    //this.opened = !this.opened;
  }

  onCall(): void {
    
    console.log("onCall");
  }
  constructor() { }

  ngOnInit() {
  }

}
