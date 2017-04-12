import { Title } from '@angular/platform-browser';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'project-detail',
  templateUrl: './project_details.component.html',
  styleUrls: ['./project_details.component.css']
})

export class ProjectDetailsComponent {

  color: string = '';
  prettyUrl: string;

  constructor(
    public route: ActivatedRoute,
    public title: Title,
    @Inject('config_service') private config_service,
    @Inject('projects_service') private projects_service,
    @Inject('languages_service') private languages_service
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projects_service.getProject(params['name'])
        .then(project => {
          this.projects_service.project = project;
          this.prettyUrl =
            this.projects_service.project.websiteUrl
            .replace('https://', '').replace('http://', '');
          this.title.setTitle(
            this.projects_service.project.name + ' – opensource.google.com'
          );
          this.projects_service.requestParams.page_token = '';
          this.languages_service.selectedLanguages = [];
          this.setColor();
          window.scrollTo(0, 0);
        })
    });
  }

  private setColor = (): void => {
    if (this.projects_service.project.primaryColor) {
      this.color = this.projects_service.project.primaryColor;
    } else if (this.projects_service.cachedColor) {
      this.color = this.projects_service.cachedColor;
    } else {
      this.color = this.projects_service.project.fallbackColor;
    }
  }

}

