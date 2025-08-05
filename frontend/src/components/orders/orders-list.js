import { CommonUtils } from "../../utils/common-utils";
import { HttpUtils } from "../../utils/http-utils";

export class OrdersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.recordsEl = document.getElementById('records');
        this.getOrders();
    };
    async getOrders() {
        const result = await HttpUtils.request('/orders');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        };
        if (result.error
            || !result.response
            || result.response.error
            || !result.response.orders) {
            return console.log('ошибка');
        };
        this.showRecords(result.response.orders);
    };
    showRecords(orders) {
        console.log(orders);
        for (let i = 0; i < orders.length; i++) {
            const trEl = document.createElement('tr');
            trEl.insertCell().innerText = orders[i].number;
            trEl.insertCell().innerText = orders[i].owner.name + ' ' + orders[i].owner.lastName;
            trEl.insertCell().innerHTML = `<a href="/freelancers/view?id=${orders[i].freelancer.id}">${orders[i].freelancer.name} ${orders[i].freelancer.lastName}</a>`;
            trEl.insertCell().innerText = (new Date(orders[i].scheduledDate)).toLocaleString('ru-RU');
            trEl.insertCell().innerText = (new Date(orders[i].deadlineDate)).toLocaleString('ru-RU');            
            const statusInfo = CommonUtils.getStatusInfo(orders[i].status);
            trEl.insertCell().innerHTML = `<span class="badge badge-${statusInfo.color}">${statusInfo.name}</span>`;
            trEl.insertCell().innerText = orders[i].completeDate ? (new Date(orders[i].completeDate)).toLocaleString('ru-RU') : ''; 

           trEl.insertCell().innerHTML = `<div class='order-tools'>
            <a href='/orders/view?id=${orders[i].id}' class='fas fa-eye'></a>
            <a href='/orders/edit?id=${orders[i].id}' class='fas fa-edit'></a>
            <a href='/orders/delete?id=${orders[i].id}' class='fas fa-trash'></a>
            </div>`;
            this.recordsEl.appendChild(trEl);
        };

        new DataTable('#data-table', {
            language: {
                "lengthMenu": "Показывать _MENU_ записей на странице",
                "search": "Фильтр:",
                "info": "Страница _PAGE_ из _PAGES_",
                "paginate": {                    
                    "next": "Вперед",
                    "previous": "Назад"
                },
            }
        });        
    };
}