import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { CategoriesService } from '../../shared/services/categories.service';
import { Category } from '../../shared/models/category.model';
import { Subscription } from 'rxjs';


@Component({
    selector: 'alc-add-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnDestroy {

    sub1: Subscription;
    @Output() categoryAdd = new EventEmitter<Category>();

    user_id: number = JSON.parse(window.localStorage.getItem('user')).id;

    constructor(private categoryService: CategoriesService) {
    }

    onSubmit(form: NgForm) {
        let {capacity} = form.value;
        if (capacity < 0) {
            capacity *= -1;
        }

        const category = new Category(this.user_id, form.value.cname, capacity);

        this.sub1 = this.categoryService.addCategory(category).subscribe((category_bd: Category) => {
            form.reset();
            form.form.patchValue({capacity: 1});
            this.categoryAdd.emit(category_bd);
        });
    }

    ngOnDestroy() {
        if (this.sub1) {
            this.sub1.unsubscribe();
        }
    }

}
