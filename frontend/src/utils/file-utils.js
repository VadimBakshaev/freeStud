export class FileUtils {
    static loadPageScript(src) {
        return new Promise((resolve, reject) => {
            const scriptEl = document.createElement('script');
            scriptEl.src = src;
            scriptEl.onload = () => resolve('Script loaded: ' + src);
            scriptEl.onerror = () => reject(new Error('Script load error for: ' + src));
            document.body.appendChild(scriptEl);
        });
    };
    static loadPageStyle(src, element) {
        const linkEl = document.createElement('link');
        linkEl.rel = 'stylesheet';
        linkEl.href = src;
        document.head.insertBefore(linkEl, element);
    };
    static convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Can not convert this file'));
        });        
    };
}