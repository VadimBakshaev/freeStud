import { HttpUtils } from "../../utils/http-utils";

export class FreelancersDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = new URLSearchParams(location.search).get('id');
        if (!id) {
            return openNewRoute('/');
        };
        this.deleteFreelancer(id);
    };
    async deleteFreelancer(id) {
        const result = await HttpUtils.request('/freelancers/' + id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        };
        if (result.error
            || !result.response
            || result.response.error
        ) {
            return console.log(result.response.message);
        };
        return this.openNewRoute('/freelancers');
    };
}