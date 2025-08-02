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
}