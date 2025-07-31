import { AuthUtils } from "../utils/auth-utils";
import { HttpUtils } from "../utils/http-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);
        if (!this.refreshToken) {
            AuthUtils.removeAuthInfo();
            return openNewRoute('/login');
        };
        this.logout();
    };

    async logout() {
        await HttpUtils.request('/logout', 'POST', {
                        refreshToken: this.refreshToken
                    });        
        
        AuthUtils.removeAuthInfo();        
        this.openNewRoute('/login');
    };
}