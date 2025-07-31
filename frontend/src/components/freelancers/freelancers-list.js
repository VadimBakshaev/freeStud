import { HttpUtils } from "../../utils/http-utils";

export class FreelancersList {
    constructor(openNewRoute) {
        this.openNewRoute=openNewRoute;
        this.getFreelancers();
    };
    async getFreelancers() {
        const result = await HttpUtils.request('/freelancers');
        if(result.redirect){
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
        console.log(freelancers);
    };
}