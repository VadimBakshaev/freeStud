export class UrlUtils{
    static getUrlParam(param){
        return new URLSearchParams(location.search).get(param);
    }
}