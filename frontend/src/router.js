import { Dashboard } from "./components/dashboard";
import { Login } from "./components/login";
import { SignUp } from "./components/sign-up";

export class Router {
    constructor() {
        this.titlePageEl = document.getElementById('title');
        this.contentPageEl = document.getElementById('content');
        this.adminlteStyleEl = document.getElementById('adminlte_style');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                filePathTemplate: '/templates/dashboard.html',
                useLayout: '/templates/layout.html',
                load() {
                    new Dashboard();
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
                useLayout: false,
                load() {

                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                load() {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    new Login();
                },
                unload(){
                    document.body.classList.remove('login-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                useLayout: false,
                load() {
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';
                    new SignUp();
                },
                unload(){
                    document.body.classList.remove('register-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css']
            },
        ];
    };
    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.openNewRoute.bind(this));
    };
    openNewRoute(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        };
        if (element) {
            e.preventDefault();
            const url = element.href.replace(location.origin, '');
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            };
            const currentRoute = location.pathname;
            history.pushState({}, '', url);
            this.activateRoute(null, currentRoute);
        };
    };
    async activateRoute(e, oldRoute = null) {
        if(oldRoute){
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                });
            };
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            };
        };
        const newRoute = this.routes.find(item => item.route === location.pathname);
        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    const linkEl = document.createElement('link');
                    linkEl.rel = 'stylesheet';
                    linkEl.href = '/css/' + style;
                    this.adminlteStyleEl
                    document.head.insertBefore(linkEl, this.adminlteStyleEl);
                });
            };
            if (newRoute.title) {
                this.titlePageEl.innerText = newRoute.title + ' | Freelance Studio';
            };
            if (newRoute.filePathTemplate) {
                if (newRoute.useLayout) {
                    await this.#constructTemplate(this.contentPageEl, newRoute.useLayout);
                    // this.contentPageEl.innerHTML = await fetch(newRoute.useLayout)
                    //     .then(response => response.text());
                    await this.#constructTemplate(document.querySelector('.content-wrapper'), newRoute.filePathTemplate);
                    // document.querySelector('.content-wrapper').innerHTML = await fetch(newRoute.filePathTemplate)
                    //     .then(response => response.text());
                    document.body.classList.add('sidebar-mini', 'layout-fixed');
                } else {
                    await this.#constructTemplate(this.contentPageEl, newRoute.filePathTemplate);
                    document.body.classList.remove('sidebar-mini', 'layout-fixed');
                    // this.contentPageEl.innerHTML = await fetch(newRoute.filePathTemplate)
                    //     .then(response => response.text());
                };
            };
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            };
        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            this.activateRoute();
        };
    };
    async #constructTemplate(templateElement, newRoute) {
        templateElement.innerHTML = await fetch(newRoute)
            .then(response => response.text());
    };
}