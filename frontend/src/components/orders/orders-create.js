import { HttpUtils } from "../../utils/http-utils";
import { ValidationUtils } from "../../utils/validation-utils";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.descriptionEl = document.getElementById('descriptionInput');
        this.amountEl = document.getElementById('amountInput');
        this.statusEl = document.getElementById('statusSelect');
        this.freelancerSelectEl = document.getElementById('freelancerSelect');
        this.scheduledCardEl = document.getElementById('scheduled');
        this.deadlineCardEl = document.getElementById('deadline');
        this.scheduledDate = null;
        this.completeDate = null;
        this.deadlineDate = null;
        const scheduledEl = $('#calendar-scheduled');
        const completeEl = $('#calendar-complete');
        const deadlineEl = $('#calendar-deadline');
        const calendarOptions = {
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock'
            },
            useCurrent: false
        }
        scheduledEl.datetimepicker(calendarOptions);
        scheduledEl.on("change.datetimepicker", (e) => { this.scheduledDate = e.date });
        deadlineEl.datetimepicker(calendarOptions);
        deadlineEl.on("change.datetimepicker", (e) => { this.deadlineDate = e.date });
        calendarOptions.buttons = { showClear: true };
        completeEl.datetimepicker(calendarOptions);
        completeEl.on("change.datetimepicker", (e) => { this.completeDate = e.date });
        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this));
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
            theme: 'bootstrap4'
        });
    };
    async saveOrder(e) {
        e.preventDefault();
        if (ValidationUtils.validateForm([
            { element: this.amountEl },
            { element: this.descriptionEl },
            { element: this.scheduledCardEl, options: { check: this.scheduledDate } },
            { element: this.deadlineCardEl, options: { check: this.deadlineDate } },
        ])) {
            const result = await HttpUtils.request('/orders', 'POST', true, {
                description: this.descriptionEl.value,
                deadlineDate: this.deadlineDate.toISOString(),
                scheduledDate: this.scheduledDate.toISOString(),
                freelancer: this.freelancerSelectEl.value,
                status: this.statusEl.value,
                completeDate: this.completeDate ? this.completeDate.toISOString() : null,
                amount: +this.amountEl.value
            });
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            };
            if (result.error
                || !result.response
                || result.response.error
            ) {
                return console.log(result.response.message);
            };
            return this.openNewRoute('/orders/view?id=' + result.response.id);
        };
    };
}