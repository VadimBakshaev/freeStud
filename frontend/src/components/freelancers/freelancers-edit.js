import config from "../../config/config";
import { CommonUtils } from "../../utils/common-utils";
import { FileUtils } from "../../utils/file-utils";
import { HttpUtils } from "../../utils/http-utils";
import { ValidationUtils } from "../../utils/validation-utils";

export class FreelancersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = new URLSearchParams(location.search).get('id');
        if (!id) {
            return openNewRoute('/');
        };
        this.breadcrumbEl = document.getElementById('breadcrumbs-freelancer');
        this.nameEl = document.getElementById('nameInput');
        this.lastNameEl = document.getElementById('lastNameInput');
        this.emailEl = document.getElementById('emailInput');
        this.educationEl = document.getElementById('educationInput');
        this.locationEl = document.getElementById('locationInput');
        this.skillsEl = document.getElementById('skillsInput');
        this.infoEl = document.getElementById('infoInput');
        this.levelEl = document.getElementById('levelSelect');
        this.avatarEl = document.getElementById('avatarInput');
        document.getElementById('updateButton').addEventListener('click', this.updateFreelancer.bind(this));
        bsCustomFileInput.init();
        this.getFreelancer(id);
    };
    async getFreelancer(id) {
        const result = await HttpUtils.request('/freelancers/' + id);
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
        this.showFreelancer(result.response)
    };
    showFreelancer(freelancer) {
        if (freelancer.avatar) {
            document.getElementById('avatar').src = config.host + freelancer.avatar;
        };
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);
        this.breadcrumbEl.innerText = `${freelancer.name} ${freelancer.lastName}`;
        this.breadcrumbEl.href = '/freelancers/view?id=' + freelancer.id;
        this.nameEl.value = freelancer.name;
        this.lastNameEl.value = freelancer.lastName;
        this.emailEl.value = freelancer.email;
        this.educationEl.value = freelancer.education;
        this.locationEl.value = freelancer.location;
        this.skillsEl.value = freelancer.skills;
        this.infoEl.value = freelancer.info;
        for (let i = 0; i < this.levelEl.options.length; i++) {
            if (freelancer.level === this.levelEl.options[i].value) {
                this.levelEl.selectedIndex = i;
            };
        };
    };
    validateForm() {
        let isValid = true;
        const textInputEl = [this.nameEl, this.lastNameEl, this.educationEl, this.locationEl, this.skillsEl, this.infoEl];
        for (let i = 0; i < textInputEl.length; i++) {
            if (!ValidationUtils.validateField(textInputEl[i])) isValid = false;            
        };
        if (!ValidationUtils.validateField(this.emailEl, {pattern:/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/})) isValid = false; 
        return isValid;
    };
    async updateFreelancer(e) {
        e.preventDefault();
        if (this.validateForm()) {
            const changedData = {};
            if (this.nameEl.value !== this.originalData.name) changedData.name = this.nameEl.value;
            if (this.lastNameEl.value !== this.originalData.lastName) changedData.lastName = this.lastNameEl.value;
            if (this.emailEl.value !== this.originalData.email) changedData.email = this.emailEl.value;
            if (this.levelEl.value !== this.originalData.level) changedData.level = this.levelEl.value;
            if (this.educationEl.value !== this.originalData.education) changedData.education = this.educationEl.value;
            if (this.locationEl.value !== this.originalData.location) changedData.location = this.locationEl.value;
            if (this.skillsEl.value !== this.originalData.skills) changedData.skills = this.skillsEl.value;
            if (this.infoEl.value !== this.originalData.info) changedData.info = this.infoEl.value;
            if (this.avatarEl.files && this.avatarEl.files.length > 0) {
                changedData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarEl.files[0]);
            };
            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/freelancers/' + this.originalData.id, 'PUT', true, changedData);
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
            return this.openNewRoute('/freelancers/view?id=' + this.originalData.id);
        };
    };
}