import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'alcFilter'
})
export class FilterPipe implements PipeTransform {

    transform(items: any, value: string, field: string): any {
        if (items.length === 0 || !value) {
            return items;
        }

        return items.filter((item) => {
            const t = Object.assign({}, item);

            if (!isNaN(t[field])) {
                t[field] += '';
            }

            if (field === 'type') {
                t[field] = t[field] === 'income' ? 'Дохід' : 'Розхід';
            }

            if (field === 'category') {
                t[field] = t['categoryName'];
            }
            return t[field].toLowerCase().indexOf(value.toLowerCase()) !== -1;
        });
    }

}
