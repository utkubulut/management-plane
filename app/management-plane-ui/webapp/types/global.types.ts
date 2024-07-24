import BaseController from "../controller/BaseController";
import { Model$RequestFailedEvent as RequestFailedEvent } from "sap/ui/model/Model";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";


export enum ApplicationModels {
    DEFAULT_ODATA = "",
}


export interface IPage {
    onODataRequestFail(event: RequestFailedEvent): void;
    onObjectMatched(event?: Route$PatternMatchedEvent): void;
}

export type PageController = IPage & BaseController;

export enum DefaultMessages {
    NO_I18N_TEXT = "The message could not be displayed due to technical issues. Contact the administrator."
}

export enum Routes {
    HOMEPAGE = "RouteHomepage",
    CHANGE_HISTORY = "RouteChangeHistory",
    KPI_DETAILS = "RouteKPIDetails",
    KPIS = "RouteKPIs",
    KPIS_OVERVIEW = "RouteKPIsOverview",
}

export enum ApplicationGroups {
    HOMEPAGE = "Homepage",
    CHANGE_HISTORY = "ChangeHistory",
    KPI_DETAILS = "KPIDetails",
    KPIS = "KPIs",
    KPIS_OVERVIEW = "KPIsIOverview"
}