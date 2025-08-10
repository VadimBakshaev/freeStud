import { HttpUtils } from "../../utils/http-utils";
import { UrlUtils } from "../../utils/url-utils";
import { ValidationUtils } from "../../utils/validation-utils";

export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
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
        const calendarOptions = {
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock'
            },
            useCurrent: false
        };
        scheduledEl.datetimepicker(Object.assign({}, calendarOptions, { date: order.scheduledDate }));
        scheduledEl.on("change.datetimepicker", (e) => { this.scheduledDate = e.date });
        deadlineEl.datetimepicker(Object.assign({}, calendarOptions, { date: order.deadlineDate }));
        deadlineEl.on("change.datetimepicker", (e) => { this.deadlineDate = e.date });        
        completeEl.datetimepicker(Object.assign({}, calendarOptions, { date: order.completeDate, buttons: { showClear: true } }));
        completeEl.on("change.datetimepicker", (e) => { this.completeDate = e.date });
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
    async updateOrder(e) {
        e.preventDefault();
        if (ValidationUtils.validateForm([
            { element: this.amountEl },
            { element: this.descriptionEl }
        ])) {
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