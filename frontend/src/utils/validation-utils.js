export class ValidationUtils {
    static validateField(field, options = {}) {
        let condition = field.value;
        if (options.hasOwnProperty('pattern')) condition = field.value && field.value.match(options.pattern);
        if (options.hasOwnProperty('check')) condition = options.check;
        if(options.hasOwnProperty('compare')) condition = field.value === options.compare.value;
        if (condition) {
            field.classList.remove('is-invalid');
            return true;
        } else {
            field.classList.add('is-invalid');
            return false;
        };
    };
    static validateForm(arrayEl) {
        let isValid = true;
        for (let i = 0; i < arrayEl.length; i++) {
            if (!this.validateField(arrayEl[i].element, arrayEl[i].options)) isValid = false;
        };
        return isValid;
    };
}