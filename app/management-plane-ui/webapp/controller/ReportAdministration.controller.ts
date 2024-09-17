import BaseController from "./BaseController";
import PageCL from "../utils/common/PageCL";
import { IPage, Routes } from "../types/global.types";
import Model, { Model$RequestFailedEvent } from "sap/ui/model/Model";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Component from "../Component";
import View from "sap/ui/core/mvc/View";
import ShellBar from "sap/f/ShellBar";
import Table from "sap/m/Table";
import MessageBox from "sap/m/MessageBox";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ColumnListItem from "sap/m/ColumnListItem"
import { ListItemBase$PressEventParameters } from "sap/m/ListItemBase";
import Event from "sap/ui/base/Event";
import Context from "sap/ui/model/Context";
import { LayoutType } from "sap/f/library";



/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class ReportAdministration extends BaseController implements IPage {

    public onInit() {
        const page = new PageCL<ReportAdministration>(this, Routes.REPORT_ADMINISTRATION);
        page.initialize();

    }
    public onNavToUploadReport() {
        this.getRouter().navTo("RouteUploadReport");
    }

    public async onObjectMatched(event: Route$PatternMatchedEvent): Promise<void> {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
        (((this.getOwnerComponent() as Component).getRootControl() as View).byId("sbApp") as ShellBar).setTitle("Report Administration");
        (((this.getOwnerComponent() as Component).getRootControl() as View).byId("sbApp") as ShellBar).setShowNavButton(true);
    }
    public onODataRequestFail(event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }
    public onItemPressed(event: Event<ListItemBase$PressEventParameters, ColumnListItem>) {
        const reportID = ((event.getSource().getBindingContext() as Context).getObject() as { reportID: string }).reportID;
        this.getRouter().navTo("RouteReportDetails", {
            layout: LayoutType.TwoColumnsMidExpanded,
            reportID:reportID
        });
    }
    public onDeleteReport() {
        const oTable = this.byId("reportTable") as Table;
        const aSelectedItems = oTable.getSelectedItems();

        if (aSelectedItems.length === 0) {
            MessageBox.error("Please select at least one report to delete.");
            return;
        }
        MessageBox.confirm("Are you sure you want to delete the selected report(s)?", {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: (oAction: string) => {
                if (oAction === MessageBox.Action.YES) {
                    const oModel = (this.getView() as View).getModel() as ODataModel;
                    const aSelectedPaths = aSelectedItems
                        .map((item: ListItemBase) => {
                            const oBindingContext = (item as ColumnListItem).getBindingContext();
                            return oBindingContext?.getPath() || null;  // Use optional chaining and fallback to null
                        })
                        .filter((path): path is string => path !== null);
                    this._deleteReportsFromOData(oModel, aSelectedPaths);
                    oTable.removeSelections();
                }
            }
        });

    }

    private _deleteReportsFromOData(oModel: ODataModel, aSelectedPaths: string[]) {
        let deleteCount = 0;
        const totalToDelete = aSelectedPaths.length;

        aSelectedPaths.forEach((sPath) => {
            oModel.remove(sPath, {
                success: () => {
                    deleteCount++;
                    if (deleteCount === totalToDelete) {
                        MessageBox.success("Selected report(s) have been deleted.");
                    }
                },
                error: (oError: { message: string; }) => {
                    MessageBox.error(`Failed to delete report: ${oError.message}`);
                }
            });
        });
    }


}

