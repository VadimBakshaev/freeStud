import { HttpUtils } from "../../utils/http-utils";

export class OrdersDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = new URLSearchParams(location.search).get('id');
        if (!id) {
            return openNewRoute('/');
        };
        this.deleteOrder(id);
    };
    async deleteOrder(id) {
        const result = await HttpUtils.request('/orders/' + id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        };
        if (result.error
            || !result.response
            || result.response.error
        ) {
            return console.log(result.response.message);
        };
        return this.openNewRoute('/orders');
    };
}