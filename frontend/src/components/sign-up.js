import { AuthUtils } from "../utils/auth-utils";
import { HttpUtils } from "../utils/http-utils";
import { ValidationUtils } from "../utils/validation-utils";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return openNewRoute('/');
        };
        this.nameEl = document.getElementById('name');
        this.lastNameEl = document.getElementById('lastName');
        this.emailEl = document.getElementById('email');
        this.passwordEl = document.getElementById('password');
        this.passwordRepeatEl = document.getElementById('passwordRepeat');
        this.checkEl = document.getElementById('agree');
        this.commonErrorEl = document.getElementById('common-error');
        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    };
    async signUp() {
        this.commonErrorEl.style.display = 'none';
        if (ValidationUtils.validateForm([
            { element: this.nameEl },
            { element: this.lastNameEl },
            { element: this.emailEl, options: { pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ } },
            { element: this.passwordEl, options: { pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/ } },
            { element: this.passwordRepeatEl, options: { compare: this.passwordEl } },
            { element: this.checkEl, options: { check: this.checkEl.checked } }
        ])) {
            const result = await HttpUtils.request('/signup', 'POST', false, {
                name: this.nameEl.value,
                lastName: this.lastNameEl.value,
                email: this.emailEl.value,
                password: this.passwordEl.value
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