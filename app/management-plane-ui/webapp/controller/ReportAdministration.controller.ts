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
import ListItemBase, { ListItemBase$PressEventParameters } from "sap/m/ListItemBase";
import Event from "sap/ui/base/Event";
import Context from "sap/ui/model/Context";
import { LayoutType } from "sap/f/library";
import formatter from "../model/formatter";
import JSONModel from "sap/ui/model/json/JSONModel";
import SmartTable, { SmartTable$BeforeRebindTableEvent } from "sap/ui/comp/smarttable/SmartTable";
import Button from "sap/m/Button";
import Link, { Link$PressEvent } from "sap/m/Link";
import Input from "sap/m/Input";
import HBox from "sap/m/HBox";
import ManagedObject from "sap/ui/base/ManagedObject";
import ObjectStatus from "sap/m/ObjectStatus";



/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class ReportAdministration extends BaseController implements IPage {
    public formatter = formatter;

    public onInit() {
        const page = new PageCL<ReportAdministration>(this, Routes.REPORT_ADMINISTRATION);
        page.initialize();
        const oDataModel = this.getComponentModel(); // Adjust based on your setup
        (this.getView() as View).setModel(oDataModel);
        oDataModel.setProperty("/ui/editMode", false);

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
            reportID: reportID
        });
    }
    public onLinkPress(event: Link$PressEvent) {
        const reportID = ((event.getSource().getBindingContext() as Context).getObject() as { reportID: string }).reportID;
        this.getRouter().navTo("RouteSections", {

            reportID: reportID
        });
        event.preventDefault();
    }
    public onEditReport() {
        const isEditMode = true;
        (this.byId("stReportTable") as SmartTable).setEditable(true);
        (this.byId("editBtn") as Button).setVisible(false);
        (this.byId("saveBtn") as Button).setVisible(true);
        (this.byId("cancelBtn") as Button).setVisible(true);

        const oModel = (this.getView() as View).getModel() as JSONModel;
        oModel.setProperty("/ui/editMode", isEditMode);

        const oItems = (this.byId("reportTable") as Table).getItems();

        oItems.forEach(item => {
            const cells = (item as ColumnListItem).getCells();

            // Toggle 'reportTitle'
            const reportTitleHBox = cells[0] as HBox;
            const reportTitleItems = reportTitleHBox.getAggregation("items") as ManagedObject[] || [];
            if (reportTitleItems.length === 2) {
                const reportTitleText = reportTitleItems[0] as Link;
                const reportTitleInput = reportTitleItems[1] as Input;
                reportTitleText.setVisible(!isEditMode);
                reportTitleInput.setVisible(isEditMode);
            }

            // Toggle 'status'
            const statusHBox = cells[2] as HBox;
            const statusItems = statusHBox.getAggregation("items") as ManagedObject[] || [];
            if (statusItems.length === 2) {
                const statusObjectStatus = statusItems[0] as ObjectStatus;
                const statusInput = statusItems[1] as Input;
                statusObjectStatus.setVisible(!isEditMode);
                statusInput.setVisible(isEditMode);
            }
        });
    }




    public onSaveReport() {
        let oModel = ((this.getView() as View).getModel() as ODataModel),
            oReportTable = ((this.getView() as View).byId("stReportTable") as SmartTable);

        if (oModel.hasPendingChanges()) {
            oModel.setUseBatch(true);
            oModel.submitChanges({
                success: (oResponse: Response) => {
                    MessageBox.success("Successfully edited.");
                    oReportTable.setEditable(false);
                    this._toggleEditMode(false);
                },
                error: () => {
                    MessageBox.error("Failed to save changes.");
                }
            });
        }
    }


    public onCancelReportEdit() {
        MessageBox.information("Changes discarded.");
        this._toggleEditMode(false);
    }

    private _toggleEditMode(editMode: boolean) {
        const oItems = (this.byId("reportTable") as Table).getItems();

        oItems.forEach(item => {
            const cells = (item as ColumnListItem).getCells();

            // Handling reportTitle (First cell)
            const reportTitleHBox = cells[0] as HBox;
            const reportTitleItems = reportTitleHBox.getAggregation("items") as ManagedObject[] || [];

            if (reportTitleItems.length === 2) {
                const reportTitleText = reportTitleItems[0] as Link; // Display version
                const reportTitleInput = reportTitleItems[1] as Input; // Editable version

                reportTitleText.setVisible(!editMode); // Show Link when not in edit mode
                reportTitleInput.setVisible(editMode); // Show Input in edit mode
            }
            // Handling status (Second cell)
            const statusHBox = cells[2] as HBox;

            // Ensure the cell is actually an HBox before using addItem
            if (statusHBox instanceof HBox) {
                let statusItems = statusHBox.getAggregation("items") as ManagedObject[] || [];

                // If items are missing, create them
                if (statusItems.length === 0) {
                    const statusObjectStatus = new ObjectStatus({
                        text: "{status}",
                        visible: !editMode
                    });
                    const statusInput = new Input({
                        value: "{status}",
                        visible: editMode
                    });

                    // Add the newly created items to the HBox
                    statusHBox.addItem(statusObjectStatus);
                    statusHBox.addItem(statusInput);

                    statusItems = statusHBox.getAggregation("items") as ManagedObject[];
                }

                if (statusItems.length === 2) {
                    const statusObjectStatus = statusItems[0] as ObjectStatus;
                    const statusInput = statusItems[1] as Input;

                    statusObjectStatus.setVisible(!editMode); // Show ObjectStatus when not in edit mode
                    statusInput.setVisible(editMode); // Show Input in edit mode
                }
            }
        });
        // Update button visibility
        (this.byId("editBtn") as Button).setVisible(!editMode);
        (this.byId("saveBtn") as Button).setVisible(editMode);
        (this.byId("cancelBtn") as Button).setVisible(editMode);
        (this.byId("stReportTable") as SmartTable).setEditable(false);
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

