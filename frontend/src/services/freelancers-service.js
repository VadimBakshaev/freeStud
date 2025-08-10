import { HttpUtils } from "../utils/http-utils";

export class FreelancersService{
    static async getFreelancers(){
        const result = await HttpUtils.request('/freelancers');
        if (result.redirect) {
            return result.redirect;
        };
        if (result.error
            || !result.response
            || result.response.error
            || !result.response.freelancers) {
            return null;
        };
        return result.response.freelancers;
    }
}