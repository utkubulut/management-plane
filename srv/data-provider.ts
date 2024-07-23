import { ApplicationService } from "@sap/cds";
import { onBeforeCreateReportHistory } from "./lib/event-handlers/homepage";
import {onReadKPIs} from "./lib/event-handlers/homepage";
import { onReadSection} from "./lib/event-handlers/homepage";
import { onKPIsViewRead} from "./lib/event-handlers/homepage";
import { onKPIStateCountRead} from "./lib/event-handlers/homepage";
import { onKPIsReportRead} from "./lib/event-handlers/homepage";
import { onKPIDocumentViewRead} from "./lib/event-handlers/homepage";
import { onDocumentRead} from "./lib/event-handlers/homepage";


export default class ManagementPlane extends ApplicationService {
async init(): Promise<void>{

/* ========================================================================================= */
/* Before Handling                                                                           */
/* ========================================================================================= */

this.before("CREATE", "ReportHistory",onBeforeCreateReportHistory);

this.on("READ","KPIs",onReadKPIs);
this.on("READ","Sections",onReadSection)
this.on("READ","VKPIs",onKPIsViewRead)
this.on("READ","VKPIStateCount",onKPIStateCountRead)
this.on("GET","VKPIsReports",onKPIsReportRead)
this.on("READ","VKPIDocuments",onKPIDocumentViewRead)
this.on("READ","Documents",onDocumentRead)


}

}