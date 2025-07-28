import { Dashboard } from "./components/dashboard";
import { Login } from "./components/login";
import { SignUp } from "./components/sign-up";

export class Router {
    constructor() {
        this.titlePageEl = document.getElementById('title');
        this.contentPageEl = document.getElementById('content');
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
                    new Login();
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                useLayout: false,
                load() {
                    new SignUp();
                }
            },
        ];
    };
    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }
    async activateRoute() {
        const newRoute = this.routes.find(item => item.route === location.pathname);
        if (newRoute) {
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
            location.href = '/404';
        }
    };
    async #constructTemplate(templateElement, newRoute) {
        templateElement.innerHTML = await fetch(newRoute)
            .then(response => response.text());
    };
}