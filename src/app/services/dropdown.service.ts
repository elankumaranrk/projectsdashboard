import { Injectable, Inject, EventEmitter } from '@angular/core';

@Injectable()
export class DropdownService {

  killDropdowns$: EventEmitter<any>;

  constructor() {
    this.killDropdowns$ = new EventEmitter();

    // kill all dropdowns with esc key
    document.body.addEventListener('keyup', (evt) => {
      const charCode = evt.keyCode || evt.which;
      if (charCode === 27) {
        this.killDropdowns();
      }
    });
  }

  public killDropdowns() {
    this.killDropdowns$.emit();
  }

}
