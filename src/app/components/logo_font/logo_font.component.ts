import { Component, Inject, Input, Output } from '@angular/core';

@Component({
  selector: 'logo-font',
  templateUrl: './logo_font.component.html',
  styleUrls: ['./logo_font.component.css']
})
export class LogoFontComponent {
  @Input() character: string;

}

