import { Component } from '@angular/core';
import { CategoryMenuComponent } from '../category_menu/category_menu.component';

@Component({
  selector: 'page-not-found',
  templateUrl: './page_not_found.component.html'
})

export class PageNotFoundComponent {
  title: string = 'Page Not Found';
}
