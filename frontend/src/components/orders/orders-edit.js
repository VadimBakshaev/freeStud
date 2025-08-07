import { HttpUtils } from "../../utils/http-utils";

export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = new URLSearchParams(location.search).get('id');
        if (!id) return openNewRoute('/');
        this.breadcrumbEl = document.getElementById('breadcrumbs-order');
        this.descriptionEl = document.getElementById('descriptionInput');
        this.amountEl = document.getElementById('amountInput');
        this.statusEl = document.getElementById('statusSelect');
        this.freelancerSelectEl = document.getElementById('freelancerSelect');
        this.scheduledCardEl = document.getElementById('scheduled');
        this.deadlineCardEl = document.getElementById('deadline');
        this.originalData = null;
        this.scheduledDate = null;
        this.completeDate = null;
        this.deadlineDate = null;

        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this));
        this.getOrder(id);
    };
    async getOrder(id) {
        const result = await HttpUtils.request('/orders/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        };
        if (result.error
            || !result.response
            || result.response.error
        ) {
            return console.log(result.response.message);
        };
        this.originalData = result.response;
        this.showOrder(result.response);
    };
    showOrder(order) {
        this.breadcrumbEl.innerText = order.number;
        this.breadcrumbEl.href = '/orders/view?id=' + order.id;
        this.amountEl.value = order.amount;
        this.descriptionEl.value = order.description;
        for (let i = 0; i < this.statusEl.options.length; i++) {
            if (order.status === this.statusEl.options[i].value) {
                this.statusEl.selectedIndex = i;
            };
        };
        this.getFreelancers(order.freelancer.id);
        const scheduledEl = $('#calendar-scheduled');
        const completeEl = $('#calendar-complete');
        const deadlineEl = $('#calendar-deadline');
        scheduledEl.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock'
            },
            date: order.scheduledDate,
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
            date: order.completeDate,
            useCurrent: false
        });
        completeEl.on("change.datetimepicker", (e) => { this.completeDate = e.date });
        deadlineEl.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock'
            },
            date: order.deadlineDate,
            useCurrent: false
        });
        deadlineEl.on("change.datetimepicker", (e) => { this.deadlineDate = e.date });
    };
    async getFreelancers(currentFreelancerId) {
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
            if (currentFreelancerId === option.value) { option.selected = true };
            this.freelancerSelectEl.appendChild(option);
        };
        $(this.freelancerSelectEl).select2({
            theme: 'bootstrap4'
        });
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
        return isValid;
    };
    async updateOrder(e) {
        e.preventDefault();
        if (this.validateForm()) {
            const changedData = {};
            if (+this.amountEl.value !== +this.originalData.amount) changedData.amount = +this.amountEl.value;
            if (this.descriptionEl.value !== this.originalData.description) changedData.description = this.descriptionEl.value;
            if (this.statusEl.value !== this.originalData.status) changedData.status = this.statusEl.value;
            if (this.freelancerSelectEl.value !== this.originalData.freelancer.id) changedData.freelancer = this.freelancerSelectEl.value;
            if (this.scheduledDate) changedData.scheduledDate = this.scheduledDate.toISOString();
            if (this.completeDate) { changedData.completeDate = this.completeDate.toISOString() }
            else if (this.completeDate === false && this.originalData.completeDate) { changedData.completeDate = null };
            if (this.deadlineDate) changedData.deadlineDate = this.deadlineDate.toISOString();

            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/orders/' + this.originalData.id, 'PUT', true, changedData);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                };
                if (result.error
                    || !result.response
                    || result.response.error
                ) {
                    return console.log(result.response.message);
                };
            };
            return this.openNewRoute('/orders/view?id=' + this.originalData.id);
        };
    };
}