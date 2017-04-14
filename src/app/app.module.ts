import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, ElementRef } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './components/app/app.component';
import { HeaderComponent } from './components/header/header.component';
import { CategoryMenuComponent } from './components/category_menu/category_menu.component';
import { ProjectExploreComponent } from './components/project_explore/project_explore.component';
import { ProjectListComponent } from './components/project_list/project_list.component';
import { ProjectDetailsComponent } from './components/project_details/project_details.component';
import { NodeBackgroundComponent } from './components/node_background/node_background.component';
import { ProjectCardComponent } from './components/project_card/project_card.component';
import { SortMenuComponent } from './components/sort_menu/sort_menu.component';
import { LoadMoreComponent } from './components/load_more/load_more.component';
import { LanguageFilterComponent } from './components/language_filter/language_filter.component';
import { LogoFontComponent } from './components/logo_font/logo_font.component';
import { PageNotFoundComponent } from './components/page_not_found/page_not_found.component';

import { ConfigService } from './services/config.service';
import { UtilsService } from './services/utils.service';
import { CategoriesService } from './services/categories.service';
import { ProjectsService } from './services/projects.service';
import { LanguagesService } from './services/languages.service';
import { DeeplinkService } from './services/deeplink.service';
import { DropdownService } from './services/dropdown.service';
import {TruncatePipe} from './services/limitTo.pipe';

const ENVIRONMENT = window['OGC_ENV'] || 'prod';
const LOCATION_STRATEGY = (ENVIRONMENT === 'dev') ?
  HashLocationStrategy :
  PathLocationStrategy;
let urlPath = ENVIRONMENT === 'dev' ?
  '/explore/featured' :
  window['location'].hash.replace('#', '');

if (ENVIRONMENT === 'prod' && urlPath === '') {
  urlPath = '/explore/featured';
}

const appRoutes:Routes = [
  { path: 'explore/:category', component: ProjectExploreComponent },
  { path: 'list/:category', component: ProjectListComponent },
  { path: 'search', component: ProjectListComponent },
  { path: ':name', component: ProjectDetailsComponent },
  { path: '', redirectTo: urlPath, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    CategoryMenuComponent,
    ProjectExploreComponent,
    ProjectListComponent,
    NodeBackgroundComponent,
    ProjectCardComponent,
    ProjectDetailsComponent,
    SortMenuComponent,
    LoadMoreComponent,
    LanguageFilterComponent,
    LogoFontComponent,
    PageNotFoundComponent,
    TruncatePipe
  ],
  providers: [
    { provide: LocationStrategy, useClass: LOCATION_STRATEGY },
    { provide: 'config_service', useClass: ConfigService },
    { provide: 'utils_service', useClass: UtilsService },
    { provide: 'categories_service', useClass: CategoriesService },
    { provide: 'projects_service', useClass: ProjectsService },
    { provide: 'languages_service', useClass: LanguagesService },
    { provide: 'deeplink_service', useClass: DeeplinkService },
    { provide: 'dropdown_service', useClass: DropdownService }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}

