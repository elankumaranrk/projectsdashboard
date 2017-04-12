import { Component, Input, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'category-menu',
  templateUrl: './category_menu.component.html',
  styleUrls: ['./category_menu.component.css']
})
export class CategoryMenuComponent {
  @Input() dropdownActive:boolean = false;
  @ViewChild('catSelect') searchInput;

  inputVal: string;
  typingTimer: any;
  defaultCategorySlug: string = 'featured';
  query: string;

  constructor(
    @Inject('config_service') private config_service,
    @Inject('categories_service') private categories_service,
    @Inject('dropdown_service') private dropdown_service,
    @Inject('projects_service') private projects_service,
    @Inject('deeplink_service') private deeplink_service,
    private title: Title,
    private router: Router,
    private activated_route: ActivatedRoute
  ) {
    this.dropdown_service.killDropdowns$.subscribe(item => {
      this.dropdownActive = false;
    });
  }

  ngOnInit() {
    this.deeplink_service.setCurrentPage();
    if (this.activated_route.snapshot.url[0].path.indexOf('search') < 0) {
      this.parseCategoryUrl();
    } else {
      this.parseSearchUrl();
    }
  }

  private parseSearchUrl = () => {
    let query;

    this.activated_route.queryParams.subscribe(params => {
      query = params['q'];
      this.inputVal = query;
      this.deeplink_service.query = query;
    });
    this.categories_service.selectedCategory = '';
    this.searchInput.nativeElement.focus();
    this.dropdownActive = false;
    this.title.setTitle(
      'Projects – ' + query + ' – opensource.google.com'
    );
  }

  private parseCategoryUrl = () => {
    this.activated_route.params.subscribe(params => {
      // category route param is set
      if (typeof params['category'] != 'undefined') {
        this.categories_service.setCategoryBySlug(params['category']);
      // category is default
      } else {
        this.deeplink_service.setCurrentPage();
        this.categories_service.setCategoryBySlug(this.defaultCategorySlug);
        this.router.navigate([
          this.deeplink_service.currentPage,
          this.categories_service.selectedCategory.slug], {
          queryParams: this.deeplink_service.getQueryParams()
        });
      }
      this.title.setTitle(
        'Projects – ' +
        this.categories_service.selectedCategory.cat +
        ' – opensource.google.com'
      );

      if (this.categories_service.dirty) {
        this.searchInput.nativeElement.focus();
      }

      this.projects_service.searchProjects();
    });

  }

  private showCategories = () => {
    this.dropdownActive = true;
    this.config_service.TRACK_EVENT(
      'Projects_Header', 'Focus', 'Category Menu Expand');
  }

  private setCategory = (evt: Event, category: any) => {
    evt.preventDefault();
    this.dropdownActive = false;
    this.deeplink_service.setCurrentPage();
    this.categories_service.selectedCategory = category;
    this.deeplink_service.query = null;
    this.projects_service.pageCount = 1;
    this.projects_service.requestParams.page_token = '';

    // dont' set category on /search page
    const page =
      this.deeplink_service.currentPage === 'search' ? 'list' :
      this.deeplink_service.currentPage;

    this.router.navigate([page, category.slug], {
      queryParams: this.deeplink_service.getQueryParams()
    });

    this.config_service.TRACK_EVENT(
      'Projects_Header', 'Click', 'Category Select ' + category.cat);
  }

  private setQuery = (query) => {
    this.query = query;
    this.inputVal = this.query;
    this.dropdownActive = false;
    this.categories_service.selectedCategory = '';
    this.deeplink_service.query = this.query;
    this.title.setTitle(
      'Projects – ' + this.query + ' – opensource.google.com'
    );
  }

  private isInvalidCharacter = (char) => {
    const invalidChars = [9, 32, 37, 39, 16, 91];
    const filteredChars = invalidChars.filter((invalid) => {
      return invalid == char;
    });
    return filteredChars.length ? true : false;
  }

  private handleKeyUp = (evt, query) => {
    const charCode = evt.keyCode || evt.which;

    this.categories_service.dirty = true;

    if (this.isInvalidCharacter(charCode)) {
      return false;
    }
    this.setQuery(query);
    this.projects_service.requestParams.page_token = '';
    // redirect to featured category if query is empty
    if (this.query.length === 0) {
      this.setCategory(evt, this.config_service.CATEGORIES[0]);
      this.dropdownActive = true;
      this.title.setTitle(
        'Projects – ' +
        this.categories_service.selectedCategory.cat +
        ' – opensource.google.com'
      );
    } else {
      this.searchProjects();
    }
  }

  private searchProjects = () => {
    this.projects_service.pageCount = 1;
    this.router.navigate(['search'], {
      queryParams: this.deeplink_service.getQueryParams()
    });
    this.config_service.TRACK_EVENT(
      'Projects_Header', 'Search', this.query);
  }
}



// WEBPACK FOOTER //
// ./source/projects/app/components/category_menu/category_menu.component.ts