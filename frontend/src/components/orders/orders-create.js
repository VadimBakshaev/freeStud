import { HttpUtils } from "../../utils/http-utils";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.descriptionEl = document.getElementById('descriptionInput');
        this.amountEl = document.getElementById('amountInput');
        this.statusEl=document.getElementById('statusSelect');
        this.freelancerSelectEl = document.getElementById('freelancerSelect');
        this.scheduledCardEl = document.getElementById('scheduled');
        this.deadlineCardEl = document.getElementById('deadline');
        this.scheduledDate = null;
        this.completeDate = null;
        this.deadlineDate = null;
        const scheduledEl = $('#calendar-scheduled');
        const completeEl = $('#calendar-complete');
        const deadlineEl = $('#calendar-deadline');
        scheduledEl.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock'
            },
            useCurrent: false
        });
        scheduledEl.on("change.datetimepicker", (e) => { this.scheduledDate = e.date });
        completeEl.datetimepicker({
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
        completeEl.on("change.datetimepicker", (e) => { this.completeDate = e.date });
        deadlineEl.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock'
            },
            useCurrent: false
        });
        deadlineEl.on("change.datetimepicker", (e) => { this.deadlineDate = e.date });
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
        if (this.validateForm()) {
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
    validateForm() {
        let isValid = true;
        const textInputEl = [this.amountEl, this.descriptionEl];
        for (let i = 0; i < textInputEl.length; i++) {
            if (textInputEl[i].value) {
                textInputEl[i].classList.remove('is-invalid');
            } else {
                textInputEl[i].classList.add('is-invalid');
                isValid = false;
            };
        };
        if (this.scheduledDate) {
            this.scheduledCardEl.classList.remove('is-invalid');
        } else {
            this.scheduledCardEl.classList.add('is-invalid');
            isValid = false;
        };
        if (this.deadlineDate) {
            this.deadlineCardEl.classList.remove('is-invalid');
        } else {
            this.deadlineCardEl.classList.add('is-invalid');
            isValid = false;
        };
        return isValid;
    };
}