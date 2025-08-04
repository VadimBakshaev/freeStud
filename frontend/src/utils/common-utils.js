import config from "../config/config";

export class CommonUtils {
    static getLevelHtml(level) {        
        switch (level) {
            case config.freelancerLevels.junior:
                return `<span class="badge badge-info">Junior</span>`;                
            case config.freelancerLevels.middle:
                return `<span class="badge badge-warning">Middle</span>`;                
            case config.freelancerLevels.senior:
                return `<span class="badge badge-success">Senior</span>`;                
            default:
                return `<span class="badge badge-secondary">Unknown</span>`;
        };
    };
    static getStatusInfo(status){
        switch (status) {
            case config.orderStatuses.new:
                return `<span class="badge badge-secondary">Новый</span>`;                
            case config.orderStatuses.confirmed:
                return `<span class="badge badge-info">Подтвержден</span>`;                
            case config.orderStatuses.canceled:
                return `<span class="badge badge-danger">Отменен</span>`;                
            case config.orderStatuses.success:
                return `<span class="badge badge-success">Выполнен</span>`;                
            default:
                return `<span class="badge badge-secondary">Неизвестно</span>`;
        };
    }
}