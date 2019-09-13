import { NgForm } from '@angular/forms';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { CategoriesService } from '../../shared/services/categories.service';
import { Category } from '../../shared/models/category.model';
import { Message } from '../../../shared/models/message.model';


@Component({
    selector: 'alc-edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit, OnDestroy {

    sub1: Subscription;
    @Input() categories: Category[] = [];
    @Output() categoryEdit = new EventEmitter<Category>();

    currentCategoryId = 1;
    currentCategory: Category;
    message: Message;

    user_id: number = JSON.parse(window.localStorage.getItem('user')).id;

    constructor(private categoryService: CategoriesService) {
    }

    private showMessage(message: Message) {
        this.message = message;
        window.setTimeout(() => {
            this.message.text = '';
        }, 3500);
    }

    ngOnInit() {
        this.message = new Message('success', '');
        this.onCategoryChange();
    }

    onCategoryChange() {
        this.currentCategory = this.categories.find(c => c.id === +this.currentCategoryId);
    }

    onSubmit(form: NgForm) {
        let {capacity} = form.value;
        if (capacity < 0) {
            capacity *= -1;
        }

        const category = new Category(this.user_id, form.value.cname, capacity, +this.currentCategoryId);

        this.sub1 = this.categoryService.updateCategory(category).subscribe((category_bd: Category) => {
            this.categoryEdit.emit(category_bd);
            this.showMessage({
                type: 'success',
                text: 'Категорія успішно змінена'
            });
        });
    }

    ngOnDestroy() {
        if (this.sub1) {
            this.sub1.unsubscribe();
        }
    }

}
