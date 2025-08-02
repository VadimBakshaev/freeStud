import { Dashboard } from "./components/dashboard";
import { FreelancersList } from "./components/freelancers/freelancers-list";
import { FreelancersView } from "./components/freelancers/freelancers-view";
import { Login } from "./components/login";
import { Logout } from "./components/logout";
import { SignUp } from "./components/sign-up";
import { FileUtils } from "./utils/file-utils";

export class Router {
    constructor() {
        this.titlePageEl = document.getElementById('title');
        this.contentPageEl = document.getElementById('content');
        this.adminlteStyleEl = document.getElementById('adminlte_style');
        this.openNewRoute = async (url) => {
            const currentRoute = location.pathname;
            history.pushState({}, '', url);
            await this.activateRoute(null, currentRoute);
        };
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard();
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,
                load: () => {

                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    new Login(this.openNewRoute);
                },
                unload() {
                    document.body.classList.remove('login-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';
                    new SignUp(this.openNewRoute);
                },
                unload() {
                    document.body.classList.remove('register-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute);
                }
            },
            {
                route: '/freelancers',
                title: 'Фрилансеры',
                filePathTemplate: '/templates/pages/freelancers/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancersList(this.openNewRoute);
                },
                styles: ['dataTables.bootstrap4.min.css'],
                scripts: [
                    'jquery.dataTables.min.js',
                    'dataTables.bootstrap4.min.js'
                ]
            },
            {
                route: '/freelancers/view',
                title: 'Фрилансер',
                filePathTemplate: '/templates/pages/freelancers/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancersView(this.openNewRoute);
                }
            }
        ];
    };

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    };

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        };
        if (element) {
            e.preventDefault();
            const url = element.href.replace(location.origin, '');
            if (
                !url
                || url.replace('#','') === location.pathname
                || url.startsWith('javascript:void(0)')
            ) {
                return;
            };
            await this.openNewRoute(url);
        };
    };
    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                });
            };
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
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
                    FileUtils.loadPageStyle('/css/' + style, this.adminlteStyleEl);
                });
            };
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                };
            };
            if (newRoute.title) {
                this.titlePageEl.innerText = newRoute.title + ' | Freelance Studio';
            };
            if (newRoute.filePathTemplate) {
                if (newRoute.useLayout) {
                    await this.#constructTemplate(this.contentPageEl, newRoute.useLayout);
                    await this.#constructTemplate(document.querySelector('.content-wrapper'), newRoute.filePathTemplate);
                    document.body.classList.add('sidebar-mini', 'layout-fixed');
                } else {
                    await this.#constructTemplate(this.contentPageEl, newRoute.filePathTemplate);
                    document.body.classList.remove('sidebar-mini', 'layout-fixed');
                };
            };
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            };
        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute();
        };
    };
    async #constructTemplate(templateElement, newRoute) {
        templateElement.innerHTML = await fetch(newRoute)
            .then(response => response.text());
    };
}