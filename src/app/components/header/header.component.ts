import { Title } from '@angular/platform-browser';
import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryMenuComponent } from '../category_menu/category_menu.component';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  heroTitle: string = 'Projects';

  constructor(
    @Inject('projects_service') private projects_service,
    @Inject('categories_service') private categories_service,
    @Inject('deeplink_service') private deeplink_service,
    private title: Title,
    private router: Router
  ) {
    this.projects_service.hasPaginated = false;
    this.title.setTitle('Projects – opensource.google.com');
  }

  private goToPage($event, page) {
    this.projects_service.pageCount = 1;
    if (this.categories_service.selectedCategory.slug) {
      this.router.navigate([
        page, this.categories_service.selectedCategory.slug
      ], {
        queryParams: this.deeplink_service.getQueryParams()
      });
    } else {
      this.router.navigate([page], {
        queryParams: this.deeplink_service.getQueryParams()
      });
    }
    $event.preventDefault();
  }

}



// WEBPACK FOOTER //
// ./source/projects/app/components/header/header.component.ts