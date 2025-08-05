import config from "../../config/config";
import { CommonUtils } from "../../utils/common-utils";
import { HttpUtils } from "../../utils/http-utils";

export class OrdersView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = new URLSearchParams(location.search).get('id');
        if (!id) {
            return openNewRoute('/');
        };
        document.getElementById('edit-link').href = '/orders/edit?id=' + id;
        document.getElementById('delete-link').href = '/orders/delete?id=' + id;
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

        this.showOrder(result.response)
    };
    showOrder(order) {
        const statusInfo = CommonUtils.getStatusInfo(order.status);
        document.getElementById('order-status-icon').classList.add(`fa-${statusInfo.ico}`);
        document.getElementById('order-status-value').innerText = statusInfo.name;
        document.getElementById('order-status').classList.add(`bg-${statusInfo.color}`);
        if (order.scheduledDate) {
            const date = new Date(order.scheduledDate);
            document.getElementById('scheduled').innerText = date.toLocaleDateString('ru-RU');
        };
        document.getElementById('complete').innerText = order.completeDate ? (new Date(order.completeDate)).toLocaleDateString('ru-RU') : '(Заказ не выполнен)';
        if (order.deadlineDate) {
            const date = new Date(order.deadlineDate);
            document.getElementById('deadline').innerText = date.toLocaleDateString('ru-RU');
        };
        if (order.freelancer.avatar) {
            document.getElementById('freelancer-avatar').src = config.host + order.freelancer.avatar;
        };
        document.getElementById('freelancer-name').innerHTML = `<a href="/freelancers/view?id=${order.freelancer.id}">${order.freelancer.name} ${order.freelancer.lastName}</a>`;
        document.getElementById('number').innerText = order.number;
        document.getElementById('description').innerText = order.description;
        document.getElementById('owner').innerText = order.owner.name + ' ' + order.owner.lastName;
        document.getElementById('amount').innerText = order.amount;
        document.getElementById('created').innerText = (new Date(order.createdAt)).toLocaleString('ru-RU');
    };
}