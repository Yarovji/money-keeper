import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user.model';
import { Message } from '../../shared/models/message.model';
import { AuthService } from '../../shared/services/auth.service';
import { fadeStateTrigger } from '../../shared/animations/fade.animation';


@Component({
    selector: 'alc-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [fadeStateTrigger]
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    message: Message;

    constructor(private usersService: UsersService, private authService: AuthService, private router: Router, private route: ActivatedRoute, private title: Title,
        private meta: Meta) {
        title.setTitle('Вхід в систему');
        meta.addTags([
            {name: 'keywords', content: 'логін, вхід, система'},
            {name: 'description', content: 'Сторінка для входу в систему'}
        ]);
    }

    ngOnInit() {
        this.message = new Message('danger', '');

        this.route.queryParams.subscribe((params: Params) => {
            if (params['nowCanLogin']) {
                this.showMessage({
                    type: 'success',
                    text: 'Тепер ви можете зайти в систему'
                });
            } else if (params['accessDenied']) {
                this.showMessage({
                    type: 'warning',
                    text: 'Для работи з системою вам потрібно авторизуватися'
                });
            }
        });

        this.form = new FormGroup({
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
        });
    }

    private showMessage(message: Message) {
        this.message = message;
        window.setTimeout(() => {
            this.message.text = '';
        }, 3500);
    }

    onSubmit() {
        const formData = this.form.value;
        this.usersService.getUserByEmail(formData.email).subscribe((user: User) => {
            if (user) {
                if (user.password === formData.password) {
                    this.message.text = '';
                    window.localStorage.setItem('user', JSON.stringify(user));
                    this.authService.login();
                    this.router.navigate(['/system', 'bill']);
                } else {
                    this.showMessage({
                        type: 'danger',
                        text: 'Пароль введено не вірно'
                    });
                }
            } else {
                this.showMessage({
                    type: 'danger',
                    text: 'Такого користувача не існує'
                });
            }
        });
    }
}
