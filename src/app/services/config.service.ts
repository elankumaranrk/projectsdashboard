import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  public API_BASE_URL: string =
    'https://dev-opensourceprojects-pa.sandbox.googleapis.com/v1/projects/';
  public API_KEY: string = 'AIzaSyDdSrWzwIWQnBTFUuqMfT16xc6-QOkPucY';
  public API_BASE_URL_PROD: string =
    'https://opensourceprojects-pa.googleapis.com/v1/projects/';
  public API_KEY_PROD: string = 'AIzaSyC-j2zg47MN_K041U-KQwiQIIdPUZtvIkg';

  public LIST_PAGE_SIZE: number = 12;
  public EXPLORE_PAGE_SIZE: number = 80;

  public MOBILE_WIDTH: number = 720;

  public COLORS:Object = {
    GREEN: '#34A853',
    RED: '#EA4335',
    BLUE: '#4285F4',
    YELLOW: '#FBBC05'
  };

  public ENVIRONMENT: string = window['OGC_ENV'] ||
    document.body.getAttribute('data-env');

  public TRACK_EVENT = (category: string, action: string, label: string) => {
    try {
      window['GA_TRACKER'].trackEvent(category, action, label);
    } catch(err) {}
  };

  public LANGUAGES: Array<string> = [
    'c',
    'c#',
    'c++',
    'dart',
    'go',
    'java',
    'javascript',
    'lua',
    'objective-c',
    'php',
    'python',
    'r',
    'ruby',
    'rust',
    'shell',
    'typescript'
  ];

  public CATEGORIES: Array<Object> = [
    {
      slug: 'production',
      cat: 'Production'
    },
    // {
    //   slug: 'accessibility',
    //   cat: 'Accessibility'
    // },
    {
      slug: 'cbo',
      cat: 'CBO'
    },
    {
      slug: 'qa1',
      cat: 'Test - QA1'
    },
    {
      slug: 'qa2',
      cat: 'Test - QA2'
    },
    {
      slug: 'qa3',
      cat: 'Test - QA3'
    },
    {
      slug: 'stg',
      cat: 'Staging'
    },
    {
      slug: 'dev1',
      cat: 'Development - QA1'
    },
    {
      slug: 'dev2',
      cat: 'Development - QA2'
    },
    {
      slug: 'dev3',
      cat: 'Development - QA3'
    }
  ];
}



// WEBPACK FOOTER //
// ./source/projects/app/services/config.service.ts