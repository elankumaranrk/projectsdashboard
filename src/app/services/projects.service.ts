import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class ProjectsService {

  projects: Array<any> = [];
  project: any = {};
  nextPage: string = null;
  pageCount: number = 1;
  view: string = '';
  colors: any = {};
  cachedColor: string;
  projectsUpdate$: EventEmitter<any>;
  APIError: boolean = false;
  requestParams: any;
  hasLoaded: boolean = false;
  hasPaginated: boolean = false;
  urlCache: string;
  totalSize: number;
  displaySize: string;

  constructor(
    @Inject('config_service') private config_service,
    @Inject('utils_service') private utils_service,
    @Inject('categories_service') private categories_service,
    @Inject('languages_service') private languages_service,
    private http: Http,
    private router: Router,
    private route: ActivatedRoute) {

    this.projectsUpdate$ = new EventEmitter();
    this.colors = this.config_service.COLORS;

    this.requestParams = {
      query: '',
      languages: '',
      fields:
      'projects.id,' +
      'projects.name,' +
      'projects.summary,' +
      'projects.iconUrlSmall,' +
      'projects.iconUrlMedium,' +
      'projects.primaryColor,' +
      'total_size,' +
      'next_page_token',
      page_size: (this.view === 'explore') ?
        this.config_service.EXPLORE_PAGE_SIZE :
        this.config_service.LIST_PAGE_SIZE,
      order_by: (this.view === 'explore') ? 'random' : 'relevance',
      page_token: ''
    }
  }

  private BASE_URL = (this.config_service.ENVIRONMENT === 'dev') ?
    this.config_service.API_BASE_URL :
    this.config_service.API_BASE_URL_PROD;

  private API_KEY = (this.config_service.ENVIRONMENT === 'dev') ?
    this.config_service.API_KEY :
    this.config_service.API_KEY_PROD;

  private setColor = (startsWith: string): string => {
    const keys = Object.keys(this.colors);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return this.colors[key];
  }

  private getFirstLetterFromString = (string: string): string => {
    const firstChar = string.toLowerCase().charAt(0);
    return /^[a-zA-Z]+$/.test(firstChar) ? firstChar : 'special';
  }

  private setProjectDefaults = (project): void => {
    project.startsWith = this.getFirstLetterFromString(project.name);
    project.fallbackColor = this.setColor(project.startsWith);

    project.RGB =
      (project.primaryColor) ?
        this.utils_service.hexToRgb(project.primaryColor) :
        this.utils_service.hexToRgb(project.fallbackColor);
  }

  private getPageSize = (): number => {
    let pageSize;
    if (this.pageCount === 1 || this.view === 'explore') {
      pageSize = this.requestParams.page_size;
    } else if (this.hasPaginated) {
      pageSize = this.requestParams.page_size;
    } else {
      pageSize = this.pageCount * this.requestParams.page_size;
    }
    return pageSize;
  }

  private processAPIResponse = (res: Response): Array<any> => {
    this.APIError = false;
    const projectsSnapshot = this.projects ? this.projects.slice() : [];

    this.projects = res.json().projects;
    this.totalSize = res.json().totalSize;

    this.displaySize = String(this.totalSize);
    if (this.totalSize > 1000) {
      this.displaySize = 'more than 1000'
    } else if (!this.totalSize) {
      this.displaySize = '0'
    }

    if (res.json().nextPageToken) {
      this.nextPage = res.json().nextPageToken;
      this.requestParams.page_token = res.json().nextPageToken;
    } else {
      this.requestParams.page_token = '';
    }

    try {
      for (var project of this.projects) {
        this.setProjectDefaults(project);
      }

      if (this.hasPaginated) {
        this.projects = projectsSnapshot.concat(this.projects);
      }

      this.projectsUpdate$.emit(this.projects);
      return this.projects;
    } catch (e) {
      this.APIError = true;
    }
  }

  private buildQueryString = (simpleSearchQuery): string => {
    let query: string = '';

    if (simpleSearchQuery) {
      query += simpleSearchQuery;
    } else if (this.categories_service.selectedCategory) {
      query += 'category:' + this.categories_service.selectedCategory.slug;
    }

    if (this.languages_service.selectedLanguages.length) {
      let languages: string = '';
      this.languages_service.selectedLanguages.forEach((language) => {
        languages += language + ' ';
      });
      query += ' language:' + languages;
    }

    return encodeURIComponent(query);
  }

  public searchProjects(simpleSearchQuery) {
    const queryString = this.buildQueryString(simpleSearchQuery);
    let URL = this.BASE_URL +
      '?key=' + this.API_KEY +
      '&q=' + queryString +
      '&page_size=' + this.getPageSize() +
      '&fields=' + this.requestParams.fields +
      '&order_by=' + this.requestParams.order_by;
    this.hasLoaded = false;

    if (this.requestParams.page_token !== '') {
      URL += '&page_token=' + this.requestParams.page_token;
    }

    return this.http.get('./app/services/db.json')
      .map((res: Response) => {
        const response = this.processAPIResponse(res);
        this.hasLoaded = true;
        this.hasPaginated = false;
        this.urlCache = URL;
        return response;
      })
      .toPromise();
  }

  public getProject(name: string) {
    const URL =
      this.BASE_URL +
      encodeURIComponent(name) +
      '?key=' + this.API_KEY;

    this.hasLoaded = false;
    this.APIError = false;

    return this.http.get('./app/services/db2.json')
      .map((res: Response) => {
        this.project = res.json();
        this.setProjectDefaults(this.project);
        if (this.project.relatedTo) {
          for (var related_project of this.project.relatedTo) {
            this.setProjectDefaults(related_project);
          }
        }
        this.hasLoaded = true;
        return this.project;
      })
      .catch(err => {
        this.APIError = true;
        return this.project;
      })
      .toPromise();

    
  }

}

