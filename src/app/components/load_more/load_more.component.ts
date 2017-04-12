import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'load-more',
  templateUrl: './load_more.component.html',
  styleUrls: ['./load_more.component.css']
})
export class LoadMoreComponent {

  label: string = 'Load More';

  constructor(
    @Inject('config_service') private config_service,
    @Inject('projects_service') private projects_service,
    @Inject('deeplink_service') private deeplink_service,
    private router: Router,
  ) {}

  public hasMore = ():boolean => {
    const totalSize = this.projects_service.totalSize;
    const projectSize = this.projects_service.projects ?
      this.projects_service.projects.length : 0;

    return projectSize < totalSize;
  }

  public loadMore = ($event: Event) => {
    $event.preventDefault();
    this.projects_service.hasPaginated = true;
    this.projects_service.pageCount++;

    this.router.navigate([], {
      queryParams: this.deeplink_service.getQueryParams()
    });

    this.config_service.TRACK_EVENT(
      'Projects_List', 'Click', 'Load More');
  }
}



// WEBPACK FOOTER //
// ./source/projects/app/components/load_more/load_more.component.ts