import { AuthUtils } from "../utils/auth-utils";
import { HttpUtils } from "../utils/http-utils";
import { ValidationUtils } from "../utils/validation-utils";

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
    async login() {
        this.commonErrorEl.style.display = 'none';
        if (ValidationUtils.validateForm([
            { element: this.emailEl, options: { pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ } },
            { element: this.passwordEl }
        ])) {
            const result = await HttpUtils.request('/login', 'POST', false, {
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