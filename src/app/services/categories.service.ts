import { Injectable, Inject } from '@angular/core';

@Injectable()
export class CategoriesService {

  public selectedCategory: any = {};
  public allCategories: Array<Object> = this.config_service.CATEGORIES;
  public searchQuery: string;
  public dirty: boolean = false;

  constructor(
    @Inject('config_service') private config_service
  ) {}

  public setCategoryBySlug = (name) => {
    const cat = this.allCategories.filter((cat: any) => {
      return cat.slug === name;
    })[0];

    this.selectedCategory = cat;
  }

}