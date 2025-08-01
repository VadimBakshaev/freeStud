import config from "../../config/config";
import { HttpUtils } from "../../utils/http-utils";

export class FreelancersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.recordsEl = document.getElementById('records');
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
        for (let i = 0; i < freelancers.length; i++) {
            const trEl = document.createElement('tr');
            trEl.insertCell().innerText = i + 1;
            trEl.insertCell().innerHTML = freelancers[i].avatar
                ? `<img src="${config.host}${freelancers[i].avatar}" class="avatar" alt="User image">`
                : '';
            trEl.insertCell().innerText = freelancers[i].name + ' ' + freelancers[i].lastName;
            trEl.insertCell().innerText = freelancers[i].email;
            let levelHtml = null;
            switch (freelancers[i].level) {
                case config.freelancerLevels.junior:
                    levelHtml = `<span class="badge badge-info">Junior</span>`;
                    break;
                case config.freelancerLevels.middle:
                    levelHtml = `<span class="badge badge-warning">Middle</span>`;
                    break;
                case config.freelancerLevels.senior:
                    levelHtml = `<span class="badge badge-success">Senior</span>`;
                    break;
                default:
                    levelHtml = `<span class="badge badge-secondary">Unknown</span>`;
            };
            trEl.insertCell().innerHTML = levelHtml;
            trEl.insertCell().innerText = freelancers[i].education;
            trEl.insertCell().innerText = freelancers[i].location;
            trEl.insertCell().innerText = freelancers[i].skills;
            trEl.insertCell().innerHTML = `<div class='freelancer-tools'>
            <a href='/freelancers/view?id=${freelancers[i].id}' class='fas fa-eye'></a>
            <a href='/freelancers/edit?id=${freelancers[i].id}' class='fas fa-edit'></a>
            <a href='/freelancers/delete?id=${freelancers[i].id}' class='fas fa-trash'></a>
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
        // $('#example2').DataTable({
        //     "paging": true,
        //     "lengthChange": false,
        //     "searching": false,
        //     "ordering": true,
        //     "info": true,
        //     "autoWidth": false,
        //     "responsive": true,
        // });
    };
}