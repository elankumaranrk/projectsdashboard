import { Injectable, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class DeeplinkService {

  query: string;
  language: string;
  sortBy: string;
  currentPage: string = 'explore';

  constructor(
    @Inject('categories_service') private categories_service,
    @Inject('languages_service') private languages_service,
    @Inject('projects_service') private projects_service,
    private router: Router,
    private activated_route: ActivatedRoute
  ) {

  }

  ngOnInit() {

  }

  private setCurrentPage = () => {
    if (this.router.url.indexOf('explore') >= 0) {
      this.currentPage = 'explore';
    } else if (this.router.url.indexOf('search') >= 0) {
      this.currentPage = 'search';
    } else {
      this.currentPage = 'list';
    };
  }

  public getQueryParams = () => {
    this.language = this.languages_service.selectedLanguages;

    const language: string = this.language.toString().replace(/,/g, ' ');
    let queryParams:any = {};

    if (this.query) {
      queryParams['q'] = this.query;
    }
    if (language) {
      queryParams['language'] = language;
    }
    if (this.sortBy) {
      queryParams['sortBy'] = this.sortBy;
    }
    if (this.projects_service.pageCount > 1) {
      queryParams['page'] = this.projects_service.pageCount;
    }
    return queryParams;
  }

}
