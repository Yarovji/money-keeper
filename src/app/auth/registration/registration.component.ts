import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user.model';
import { BillService } from '../../system/shared/services/bill.service';
import { Bill } from '../../system/shared/models/bill.model';


@Component({
    selector: 'alc-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

    form: FormGroup;

    constructor(private usersService: UsersService, private billService: BillService, private router: Router, private title: Title) {
        title.setTitle('Реєстрація');
    }

    ngOnInit() {
        this.form = new FormGroup({
            'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmail.bind(this)),
            'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
            'name': new FormControl(null, [Validators.required]),
            'agree': new FormControl(false, [Validators.requiredTrue])
        });
    }

    onSubmit() {
        const {email, password, name} = this.form.value;
        const newUser = new User(email, password, name);

        this.usersService.createNewUser(newUser).subscribe((user: User) => {
            const new_bill = new Bill(user.id, 0, 'UAH');
            this.billService.addBill(new_bill).subscribe();
            this.router.navigate(['/login'], {
                queryParams: {
                    nowCanLogin: true
                }
            });
        });
    }

    forbiddenEmail(control: FormControl): Promise<any> {
        return new Promise((resolve, reject) => {
            this.usersService.getUserByEmail(control.value).subscribe((user: User) => {
                if (user) {
                    resolve({'forbiddenEmail': true});
                } else {
                    resolve(null);
                }
            });
        });
    }

}
