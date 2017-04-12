import { Component, Inject, Input, Output } from '@angular/core';

@Component({
  selector: 'node-background',
  templateUrl: './node_background.component.html',
  styleUrls: ['./node_background.component.css']
})
export class NodeBackgroundComponent {
  @Input() class: string;
  @Input() color: string;
  @Input() size: any;
  @Input() zoomed: boolean = false;
}
