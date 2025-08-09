export class ValidationUtils {
    static validateField(field, options={}) {
        let condition = field.value;
        if (options.hasOwnProperty('pattern')) condition = field.value && field.value.match(options.pattern);
        if (condition) {
            field.classList.remove('is-invalid');
            return true;
        } else {
            field.classList.add('is-invalid');
            return false;
        };
    };
    // static validateForm(arrayEl) {
    //     let isValid = true;
    //     const textInputEl = [this.nameEl, this.lastNameEl, this.educationEl, this.locationEl, this.skillsEl, this.infoEl];
    //     for (let i = 0; i < textInputEl.length; i++) {
    //         if (!ValidationUtils.validateField(textInputEl[i])) isValid = false;            
    //     };
    //     if (!ValidationUtils.validateField(this.emailEl, /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) isValid = false; 
    //     return isValid;
    // };
}