import { FileUtils } from "../../utils/file-utils";
import { HttpUtils } from "../../utils/http-utils";

export class FreelancersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.nameEl = document.getElementById('nameInput');
        this.lastNameEl = document.getElementById('lastNameInput');
        this.emailEl = document.getElementById('emailInput');
        this.educationEl = document.getElementById('educationInput');
        this.locationEl = document.getElementById('locationInput');
        this.skillsEl = document.getElementById('skillsInput');
        this.infoEl = document.getElementById('infoInput');
        this.levelEl = document.getElementById('levelSelect');
        this.avatarEl = document.getElementById('avatarInput');
        document.getElementById('saveButton').addEventListener('click', this.saveFreelancer.bind(this));
        bsCustomFileInput.init();
    };    
    validateForm() {
        let isValid = true;
        const textInputEl = [this.nameEl, this.lastNameEl, this.educationEl, this.locationEl, this.skillsEl, this.infoEl];
        for (let i = 0; i < textInputEl.length; i++) {
            if (textInputEl[i].value) {
                textInputEl[i].classList.remove('is-invalid');
            } else {
                textInputEl[i].classList.add('is-invalid');
                isValid = false;
            };
        };
        if (this.emailEl.value && this.emailEl.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailEl.classList.remove('is-invalid');
        } else {
            this.emailEl.classList.add('is-invalid');
            isValid = false;
        };
        return isValid;
    };
    async saveFreelancer(e) {
        e.preventDefault();
        if (this.validateForm()) {
            const data = {
                name: this.nameEl.value,
                lastName: this.lastNameEl.value,
                email: this.emailEl.value,
                level: this.levelEl.value,
                education: this.educationEl.value,
                location: this.locationEl.value,
                skills: this.skillsEl.value,
                info: this.infoEl.value
            };
            if (this.avatarEl.files && this.avatarEl.files.length > 0) { 
                data.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarEl.files[0]);
            };
            const result = await HttpUtils.request('/freelancers', 'POST',true, data);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            };
            if (result.error
                || !result.response
                || result.response.error
            ) {
                return console.log(result.response.message);
            };
            return this.openNewRoute('/freelancers/view?id=' + result.response.id);
        };
    }
}