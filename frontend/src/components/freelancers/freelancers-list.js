import config from "../../config/config";
//import { FreelancersService } from "../../services/freelancers-service";
import { CommonUtils } from "../../utils/common-utils";
import { HttpUtils } from "../../utils/http-utils";

export class FreelancersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.recordsEl = document.getElementById('records');

        //this.showRecords();
        this.getFreelancers();
    };
    async getFreelancers() {
        const result = await HttpUtils.request('/freelancers');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        };
        if (result.error
            || !result.response
            || result.response.error
            || !result.response.freelancers) {
            return console.log('ошибка');
        };
        this.showRecords(result.response.freelancers)
    };
    showRecords(freelancers) {
        // const freelancers = await FreelancersService.getFreelancers();
        // if (!freelancers) return null;
        // if (typeof (freelancers) === 'string') return this.openNewRoute(freelancers);
        for (let i = 0; i < freelancers.length; i++) {
            const trEl = document.createElement('tr');
            trEl.insertCell().innerText = i + 1;
            trEl.insertCell().innerHTML = freelancers[i].avatar
                ? `<img src="${config.host}${freelancers[i].avatar}" class="avatar" alt="User image">`
                : '';
            trEl.insertCell().innerText = freelancers[i].name + ' ' + freelancers[i].lastName;
            trEl.insertCell().innerText = freelancers[i].email;
            trEl.insertCell().innerHTML = CommonUtils.getLevelHtml(freelancers[i].level);
            trEl.insertCell().innerText = freelancers[i].education;
            trEl.insertCell().innerText = freelancers[i].location;
            trEl.insertCell().innerText = freelancers[i].skills;
            trEl.insertCell().innerHTML = CommonUtils.generateGridToolsColumn('freelancers', freelancers[i].id);
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