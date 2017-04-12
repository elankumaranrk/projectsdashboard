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
      slug: 'featured',
      cat: 'Featured'
    },
    // {
    //   slug: 'accessibility',
    //   cat: 'Accessibility'
    // },
    {
      slug: 'cloud',
      cat: 'Cloud'
    },
    {
      slug: 'analytics-visualization',
      cat: 'Data Analytics & Visualization'
    },
    {
      slug: 'databases',
      cat: 'Databases'
    },
    {
      slug: 'developer-tools',
      cat: 'Developer Tools'
    },
    {
      slug: 'education',
      cat: 'Education & Science'
    },
    {
      slug: 'enterprise',
      cat: 'Enterprise'
    },
    {
      slug: 'games',
      cat: 'Games & Entertainment'
    },
    {
      slug: 'graphics-video-audio',
      cat: 'Graphics, Video, & Audio'
    },
    {
      slug: 'i18n',
      cat: 'Internationalization & Localization'
    },
    {
      slug: 'iot',
      cat: 'Internet of Things'
    },
    {
      slug: 'geo',
      cat: 'Location & Maps'
    },
    {
      slug: 'machine-learning',
      cat: 'Machine Learning, Neural Networks, & AI'
    },
    // {
    //   slug: 'messaging',
    //   cat: 'Messaging & Communications'
    // },
    {
      slug: 'mobile',
      cat: 'Mobile'
    },
    {
      slug: 'networking',
      cat: 'Networking'
    },
    {
      slug: 'programming',
      cat: 'Programming'
    },
    {
      slug: 'samples',
      cat: 'Samples & Examples'
    },
    {
      slug: 'security',
      cat: 'Security'
    },
    {
      slug: 'testing',
      cat: 'Testing'
    },
    {
      slug: 'utilities',
      cat: 'Utilities'
    },
    {
      slug: 'web',
      cat: 'Web'
    }
  ];
}



// WEBPACK FOOTER //
// ./source/projects/app/services/config.service.ts