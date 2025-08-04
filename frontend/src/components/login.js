import { AuthUtils } from "../utils/auth-utils";
import { HttpUtils } from "../utils/http-utils";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return openNewRoute('/');
        };
        this.emailEl = document.getElementById('email');
        this.passwordEl = document.getElementById('password');
        this.checkEl = document.getElementById('remember');
        this.commonErrorEl = document.getElementById('common-error');
        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    };
    validateForm() {
        let isValid = true;
        if (this.emailEl.value && this.emailEl.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailEl.classList.remove('is-invalid');
        } else {
            this.emailEl.classList.add('is-invalid');
            isValid = false;
        };
        if (this.passwordEl.value) {
            this.passwordEl.classList.remove('is-invalid');
        } else {
            this.passwordEl.classList.add('is-invalid');
            isValid = false;
        };
        return isValid;
    };
    async login() {
        this.commonErrorEl.style.display = 'none';
        if (this.validateForm()) {
            const result = await HttpUtils.request('/login', 'POST',false, {
                email: this.emailEl.value,
                password: this.passwordEl.value,
                rememberMe: this.checkEl.checked
            });

            if (result.error
                || !result.response
                || result.response.error
                || !result.response.accessToken
                || !result.response.refreshToken
                || !result.response.id
                || !result.response.name) {
                this.commonErrorEl.style.display = 'block';
                return;
            };
            AuthUtils.setAuthInfo(result.response.accessToken, result.response.refreshToken, {
                id: result.response.id,
                name: result.response.name
            });
            this.openNewRoute('/');
        };
    };
}