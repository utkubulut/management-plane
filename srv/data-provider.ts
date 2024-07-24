import { ApplicationService } from "@sap/cds";
import { onBeforeCreateReportHistory } from "./lib/event-handlers/homepage";



export default class ManagementPlane extends ApplicationService {
    async init(): Promise<void> {

        /* ========================================================================================= */
        /* Before Handling                                                                           */
        /* ========================================================================================= */

        this.before("CREATE", "ReportHistory", onBeforeCreateReportHistory);

        return super.init();
    }
}