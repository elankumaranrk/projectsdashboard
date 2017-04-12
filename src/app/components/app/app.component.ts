import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import 'rxjs/add/operator/skip';

@Component({
  selector: 'projects-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    @Inject('dropdown_service') private dropdown_service,
    @Inject('projects_service') private projects_service,
    @Inject('languages_service') private languages_service,
    @Inject('deeplink_service') private deeplink_service,
    @Inject('categories_service') private categories_service,
    public router: Router,
    public activated_route: ActivatedRoute
  ) {
  };

  ngOnInit() {

    let languages: Array<any> = [];

    // Flush "next page" when using browser back and forward buttons
    window.addEventListener('popstate', () => {
      this.projects_service.requestParams.page_token = '';
    });

    // Projects state is bound to query parameters
    this.activated_route.queryParams.subscribe(params => {

      if (params['q']) {
        this.deeplink_service.query = params['q'];
      }
      if (params['language']) {
        languages = params['language'].split(' ');
        this.languages_service.selectedLanguages = languages;
      }
      if (params['sortBy']) {
        this.projects_service.requestParams.order_by = params['sortBy'];
        this.deeplink_service.sortBy = params['sortBy'];
      } else {
        this.projects_service.requestParams.order_by = 'relevance';
      }
      if (params['page']) {
        this.projects_service.pageCount = params['page'];
      } else {
        this.projects_service.pageCount = 1;
      }

      if (this.deeplink_service.query) {
        this.projects_service.searchProjects(this.deeplink_service.query);
      } else if (this.categories_service.selectedCategory.cat) {
        this.projects_service.searchProjects();
      }
    });

  }

}
