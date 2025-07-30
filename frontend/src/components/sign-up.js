export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.nameEl = document.getElementById('name');
        this.lastNameEl = document.getElementById('lastName');
        this.emailEl = document.getElementById('email');
        this.passwordEl = document.getElementById('password');
        this.passwordRepeatEl = document.getElementById('passwordRepeat');
        this.checkEl = document.getElementById('agree');
        this.commonErrorEl = document.getElementById('common-error');
        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    };
    validateForm() {
        let isValid = true;
        if (this.nameEl.value) {
            this.nameEl.classList.remove('is-invalid');
        } else {
            this.nameEl.classList.add('is-invalid');
            isValid = false;
        };
        if (this.lastNameEl.value) {
            this.lastNameEl.classList.remove('is-invalid');
        } else {
            this.lastNameEl.classList.add('is-invalid');
            isValid = false;
        };
        if (this.emailEl.value && this.emailEl.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailEl.classList.remove('is-invalid');
        } else {
            this.emailEl.classList.add('is-invalid');
            isValid = false;
        };
        if (this.passwordEl.value && this.passwordEl.value.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/)) {
            this.passwordEl.classList.remove('is-invalid');
        } else {
            this.passwordEl.classList.add('is-invalid');
            isValid = false;
        };
        if (this.passwordRepeatEl.value === this.passwordEl.value) {
            this.passwordRepeatEl.classList.remove('is-invalid');
        } else {
            this.passwordRepeatEl.classList.add('is-invalid');
            isValid = false;
        };
        if (this.checkEl.checked) {
            this.checkEl.classList.remove('is-invalid');
        } else {
            this.checkEl.classList.add('is-invalid');
            isValid = false;
        };

        return isValid;
    };
    async signUp() {
        this.commonErrorEl.style.display = 'none';
        if (this.validateForm()) {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: this.nameEl.value,
                    lastName: this.lastNameEl.value,
                    email: this.emailEl.value,
                    password: this.passwordEl.value
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