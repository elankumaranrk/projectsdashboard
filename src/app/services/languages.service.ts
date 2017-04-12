import { Injectable, Inject } from '@angular/core';

@Injectable()
export class LanguagesService {

  constructor(
    @Inject('config_service') private config_service
  ) {}

  public selectedLanguages: Array<string> = [];
  public allLanguages: Array<string> = this.config_service.LANGUAGES;
}
