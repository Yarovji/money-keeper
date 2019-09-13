import { Component, OnInit } from '@angular/core';

import { CategoriesService } from '../shared/services/categories.service';
import { Category } from '../shared/models/category.model';


@Component({
  selector: 'alc-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.scss']
})
export class RecordsPageComponent implements OnInit {

  user_id: number = JSON.parse(window.localStorage.getItem('user')).id;
  categories: Category[] = [];
  isLoaded = false;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.categoriesService.getCategories(this.user_id).subscribe((categories: Category[]) => {
      this.categories = categories;
      this.isLoaded = true;
    });
  }

  newCategoryAdded (category: Category) {
    this.categories.push(category);
  }

  categoryWhasEdit (category: Category) {
    const idx = this.categories.findIndex(c => c.id === category.id);
    this.categories[idx] = category;
  }

}
