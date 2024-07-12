export default {
   formatRowHighlight: function(status: string): string {
        if (status === "AI Proposal") {
            return "Error";
        } else if (status === "In Progress") {
            return "Warning";
        } else if (status === "Done") {
            return "Success";
        }
        return "Success";
    },
    formatIcons(sKpi: string): string {
        let sIcon = "";
        switch (sKpi) {
            case "E1-3|27":
                sIcon = "sap-icon://e-care";
                break;
            case "E1-3|30a":
                sIcon = "sap-icon://world";
                break;
            case "G1-2|15a":
                sIcon = "sap-icon://enablement";
                break;
            case "G1-2|15b":
                sIcon = "sap-icon://family-protection";
                break;
            case "S1-1|23":
                sIcon = "sap-icon://shipping-status";
                break;
            case "S1-1|24a":
                sIcon = "sap-icon://inventory";
                break;
            default:
                sIcon = "sap-icon://accidental-leave";
                break;
        }
        return sIcon;
    },

    formatIconColor(sKpi: string): string {
        let sIconColor = "";
        switch (sKpi) {
            case "E1-3|27":
                sIconColor = "Accent8";
                break;
            case "E1-3|30a":
                sIconColor = "Accent1";
                break;
            case "G1-2|15a":
                sIconColor = "Accent6";
                break;
            case "G1-2|15b":
                sIconColor = "Accent4";
                break;
            case "S1-1|23":
                sIconColor = "Accent5";
                break;
            case "S1-1|24a":
                sIconColor = "Accent10";
                break;
            default:
                sIconColor = "Accent3";
                break;
        }
        return sIconColor;
    },

    formatPageTextLine(page: string, text: string): string {
        return `${page}, ${text}`;
    }

}