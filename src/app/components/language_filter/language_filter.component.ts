import { Component, Input, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'language-filter',
  templateUrl: './language_filter.component.html',
  styleUrls: ['./language_filter.component.css']
})
export class LanguageFilterComponent {

  dropdownActive: boolean;
  body: HTMLElement = document.body;

  constructor(
    @Inject('config_service') private config_service,
    @Inject('languages_service') private languages_service,
    @Inject('projects_service') private projects_service,
    @Inject('deeplink_service') private deeplink_service,
    @Inject('dropdown_service') private dropdown_service,
    private router: Router,
    private activated_route: ActivatedRoute
  ) {
    this.dropdown_service.killDropdowns$.subscribe(item => {
      this.dropdownActive = false;
      this.body.className = this.body.className.replace(' modal-active', '');
    });
  }

  ngOnInit() {}

  private toggleDropdown(evt:Event) {
    evt.stopPropagation();
    this.dropdownActive = !this.dropdownActive;

    if (this.body.className.indexOf('modal-active') < 0) {
      this.body.className += ' modal-active';
    } else {
      this.body.className =
        this.body.className
        .replace(' modal-active', '')
        .replace('modal-active', '');
    }

    this.config_service.TRACK_EVENT(
      'Projects_List', 'Toggle', 'Filter Language Menu');
  }

  private updateUrl = () => {
    this.projects_service.pageCount = 1;
    this.router.navigate([], {
      queryParams: this.deeplink_service.getQueryParams()
    });
    this.projects_service.requestParams.page_token = '';
  }

  public selectLanguage(event: Event, language: string) {
    if (this.languages_service.selectedLanguages.indexOf(language) >= 0) {
      this.removeLanguage(language);
    } else {
      this.languages_service.selectedLanguages.push(language);
    }
    this.updateUrl();

    this.config_service.TRACK_EVENT(
      'Projects_List', 'Toggle', 'Filter by ' + language);
  }

  public removeLanguage(language: string) {
    const index = this.languages_service.selectedLanguages.indexOf(language);
    this.languages_service.selectedLanguages.splice(index, 1);
    this.updateUrl();

    this.config_service.TRACK_EVENT(
      'Projects_List', 'Click', 'Remove ' + language);
  }
}



// WEBPACK FOOTER //
// ./source/projects/app/components/language_filter/language_filter.component.ts