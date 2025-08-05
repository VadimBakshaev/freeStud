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
    static getStatusInfo(status) {
        const info = {};
        switch (status) {
            case config.orderStatuses.new:
                info.name = 'Новый';
                info.color = 'secondary';
                info.ico = 'star';
                return info;
            case config.orderStatuses.confirmed:
                info.name = 'Подтвержден';
                info.color = 'info';
                info.ico = 'eye';
                return info;
            case config.orderStatuses.canceled:
                info.name = 'Отменен';
                info.color = 'danger';
                info.ico = 'times';
                return info;
            case config.orderStatuses.success:
                info.name = 'Выполнен';
                info.color = 'success';
                info.ico = 'check';
                return info;
            default:
                info.name = 'Неизвестно';
                info.color = 'secondary';
                info.ico = 'times';
                return info;
        };
    };
}