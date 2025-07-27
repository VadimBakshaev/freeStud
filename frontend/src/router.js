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
                load() {
                    new Dashboard();
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
                load() {

                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                load() {
                    new Login();
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
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
                this.contentPageEl.innerHTML = await fetch(newRoute.filePathTemplate)
                    .then(response => response.text());
            };
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            };
        } else {
            console.log('No route found');
            location.href = '/404';
        }
    };
}