export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
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
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: this.emailEl.value,
                    password: this.passwordEl.value,
                    rememberMe: this.checkEl.checked
                })
            });
            const result = await response.json();
            if (result.error || !result.accessToken || !result.refreshToken || !result.id || !result.name) {
                this.commonErrorEl.style.display = 'block';
                return;
            };
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('userInfo', JSON.stringify({
                id: result.id,
                name: result.name
            }));
            this.openNewRoute('/');
        };
    };
}