import { HttpUtils } from "../../utils/http-utils";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.freelancerSelectEl = document.getElementById('freelancerSelect');
        $('#calendar-scheduled').datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock'
            },
            useCurrent: false
        });
        $('#calendar-complete').datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock'
            },
            buttons: {
                showClear: true
            },
            useCurrent: false
        });
        $('#calendar-deadline').datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock'
            },
            useCurrent: false
        });
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
        for (let i = 0; i < result.response.freelancers.length; i++) {
            const option = document.createElement('option');
            option.value = result.response.freelancers[i].id;
            option.innerText = `${result.response.freelancers[i].name} ${result.response.freelancers[i].lastName}`;
            this.freelancerSelectEl.appendChild(option);
        };
        $(this.freelancerSelectEl).select2({
            theme:'bootstrap4'
        });
    };
}