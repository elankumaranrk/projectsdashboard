import { Component, Inject } from '@angular/core';

import { ProjectCardComponent } from '../project_card/project_card.component';
import { SortMenuComponent } from '../sort_menu/sort_menu.component';
import { LoadMoreComponent } from '../load_more/load_more.component';

@Component({
  selector: 'project-list',
  templateUrl: './project_list.component.html',
  styleUrls: ['./project_list.component.css']
})
export class ProjectListComponent {

  projects: Array<any>;

  constructor(
    @Inject('config_service') private config_service,
    @Inject('projects_service') private projects_service,
    @Inject('categories_service') private categories_service,
    @Inject('deeplink_service') private deeplink_service
  ) {
    this.deeplink_service.query = null;
    this.projects_service.view = 'list';
    this.projects_service.requestParams.page_size =
      this.config_service.LIST_PAGE_SIZE;
    this.projects_service.requestParams.page_token = '';

    // set sort param
    if (this.deeplink_service.getQueryParams().sortBy) {
      this.projects_service.requestParams.order_by =
        this.deeplink_service.getQueryParams().sortBy
    } else {
      this.projects_service.requestParams.order_by = 'relevance';
    }

  }

  ngOnInit() {

  }

}
