import { Component, Inject, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sort-menu',
  templateUrl: './sort_menu.component.html',
  styleUrls: ['./sort_menu.component.css']
})
export class SortMenuComponent {

  @Input() dropdownActive:boolean = false;
  title:string = 'Sort By';
  sortParams:Array<any> = [
    'Relevance',
    'Name'
  ];
  selectedParam:string;

  constructor(
    @Inject('config_service') private config_service,
    @Inject('dropdown_service') private dropdown_service,
    @Inject('projects_service') private projects_service,
    @Inject('deeplink_service') private deeplink_service,
    @Inject('categories_service') private categories_service,
    private router:Router,
    private activated_route:ActivatedRoute
  ) {
    this.selectedParam = this.deeplink_service.sortBy || this.sortParams[0];
    this.dropdown_service.killDropdowns$.subscribe(item => {
      this.dropdownActive = false;
    });

    this.activated_route.queryParams.subscribe(params => {
      if (params['sortBy']) {
        this.selectedParam = params['sortBy'];
      }
    });
  }

  private toggleDropdown($event:Event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dropdownActive = !this.dropdownActive;

    this.config_service.TRACK_EVENT(
      'Projects_List', 'Toggle', 'Sort by menu');
  }

  private sort($event:Event, param:string) {
    $event.preventDefault();
    $event.stopPropagation();
    this.deeplink_service.sortBy = param;
    this.selectedParam = param;
    this.dropdownActive = false;
    this.projects_service.requestParams.order_by = param.toLowerCase();
    this.projects_service.requestParams.page_token = '';
    this.router.navigate([], {
      queryParams: this.deeplink_service.getQueryParams()
    });

    this.config_service.TRACK_EVENT(
      'Projects_List', 'Click', 'Sort by ' + param);

  }
}

