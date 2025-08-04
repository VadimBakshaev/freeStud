import config from "../config/config";
import { AuthUtils } from "./auth-utils";

export class HttpUtils {
    static async request(url, method = 'GET', auth = true, body = null) {
        const result = {
            error: false,
            response: null
        };

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        };
        let token = null;
        if (method === 'GET' || auth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['authorization'] = token;
            }
        }
        if (body) {
            params.body = JSON.stringify(body);
        }
        let response = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        };
        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (response.status === 401) {
                if (token) {
                    const updateTkensResult = await AuthUtils.updateTokens();
                    if (updateTkensResult) {
                        return this.request(url, method, body);
                    } else {
                        result.redirect = '/logout';
                    }
                } else {
                    result.redirect = '/login';
                };
            }
        };
        return result;
    }
}