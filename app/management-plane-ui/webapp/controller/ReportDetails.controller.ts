import BaseController from "./BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import formatter from "../model/formatter";
import View from "sap/ui/core/mvc/View";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { IBindingParams, IDocuments, IKPIs, IReportHistory, IUserAPI } from "com/ndbs/managementplaneui/types/kpis.types"
import Title from "sap/m/Title";
import ObjectPageLayout, { ObjectPageLayout$BeforeNavigateEvent } from "sap/uxap/ObjectPageLayout";
import SmartTable, { SmartTable$BeforeRebindTableEvent } from "sap/ui/comp/smarttable/SmartTable";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ShellBar from "sap/f/ShellBar";
import SmartForm from "sap/ui/comp/smartform/SmartForm";
import UserAPI from "../utils/session/UserAPI";
import ODataCreateCL from "ui5/antares/odata/v2/ODataCreateCL";
import { IPage, Routes } from "../types/global.types";
import PageCL from "../utils/common/PageCL";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import Component from "../Component";
import ObjectPageSection from "sap/uxap/ObjectPageSection";
import Dialog from "sap/m/Dialog";
import Fragment from "sap/ui/core/Fragment";
import UploadSet from "sap/m/upload/UploadSet";
import Context from "sap/ui/model/Context";
import MessageBox from "sap/m/MessageBox";
import Table from "sap/m/Table";
import ListItemBase from "sap/m/ListItemBase";
import ColumnListItem from "sap/m/ColumnListItem";

/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class ReportDetails extends BaseController implements IPage {
    public formatter = formatter;
    private reportID: string;
    private customerID: string;
    private _oUploadDialog: Dialog | undefined;

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit() {
        const page = new PageCL<ReportDetails>(this, Routes.REPORT_DETAILS);
        page.initialize();
        const oOPL = (this.getView() as View).byId("oplReportDetails") as ObjectPageLayout;
        oOPL.attachBeforeNavigate(this.onBeforeNavigate.bind(this));
    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public onNavToHomepage(): void {
        this.getRouter().navTo("RouteHomepage");
    }
    public onBeforeRebindTable(event: SmartTable$BeforeRebindTableEvent) {
        const binding = event.getParameter("bindingParams") as IBindingParams;
        const kpiFilters = new Filter("reportID", FilterOperator.EQ, this.reportID);
        binding.filters.push(kpiFilters);
    }
    public onBeforeRebindTreeTable(event: SmartTable$BeforeRebindTableEvent) {
        const binding = event.getParameter("bindingParams") as IBindingParams;
        const reportFilters = new Filter("reportID", FilterOperator.EQ, this.reportID);
        binding.filters.push(reportFilters);
    }
    public onBeforeNavigate(event: ObjectPageLayout$BeforeNavigateEvent) {
        const oOPL = ((this.getView() as View).byId("oplReportDetails") as ObjectPageLayout);
        const oSection = (event.getParameter("section") as ObjectPageSection);
        event.preventDefault();
        oOPL.setSelectedSection(oSection);
    }
    public onPressAdd(): void {
        if (!this._oUploadDialog) {
            // Use Fragment.load with type assertion to ensure correct typing
            Fragment.load({
                name: "com.ndbs.managementplaneui.fragments.common.UploadSet",
                controller: this
            }).then((oDialog) => {
                this._oUploadDialog = oDialog as Dialog; // Type assertion to cast as Dialog
                (this.getView() as View).addDependent(this._oUploadDialog);
                this._oUploadDialog.open();
            }).catch(err => {
                console.error("Failed to load dialog fragment:", err);
            });
        } else {
            this._oUploadDialog.open();
        }
    }

    public onUploadReportDocuments(): void {
        if (!this._oUploadDialog) {
            console.error("Upload dialog is not initialized.");
            return;
        }

        const oContent = this._oUploadDialog.getContent();
        const oUploadSet = oContent[0] as UploadSet;
        if (!oUploadSet) {
            console.error("UploadSet not found!");
            return;
        }

        const oFiles = oUploadSet.getIncompleteItems(); // Get all files from the UploadSet
        // Loop through each file in the UploadSet
        oFiles.forEach((oItem) => {
            const oFile = oItem.getFileObject(); // Retrieve file object

            // Create a new entry for Documents entity
            if (oFile instanceof File) {
                const mimeTypeToExtension: { [key: string]: string } = {
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx", // XLSX
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx", // DOCX
                    "application/vnd.ms-powerpoint": "ppt", // PPT
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx", // PPTX
                    "application/pdf": "pdf", // PDF
                };
                const fileExtension = mimeTypeToExtension[oFile.type] || "";
                const oNewDocument = {
                    ID: window.crypto.randomUUID(), // Generate a unique ID
                    reportID: this.reportID,
                    title: oFile.name,
                    type: fileExtension,
                    url: "/uploaded/documents/" + encodeURIComponent(oFile.name), // URL encoding for safe file paths
                    lastModified: new Date().toISOString(),
                };

                const creator = new ODataCreateCL<IDocuments>(this, "Documents");
                creator.setData(oNewDocument);
                creator.create().then(() => {
                    MessageBox.success(`File(s) uploaded successfully!`);
                }).catch(err => {
                    MessageBox.error(`Error while uploading + ${err}`);
                });
            }
        });

        this.onCloseUploadDialog();
    }

    public onCloseUploadDialog(): void {
        if (this._oUploadDialog) {
            this._oUploadDialog.close();
        }
    }

    public onPressDelete() {
        const oTable = (this.byId("iddTreeDocumentTable") as Table);
        const aSelectedItems = oTable.getSelectedItems();

        if (aSelectedItems.length === 0) {
            MessageBox.error("Please select at least one report to delete.");
            return;
        }
        MessageBox.confirm("Are you sure you want to delete the selected document(s)?", {
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
                    this._deleteDocumentsFromOData(oModel, aSelectedPaths);
                    oTable.removeSelections();
                }
            }
        });

    }
    private _deleteDocumentsFromOData(oModel: ODataModel, aSelectedPaths: string[]) {
        let deleteCount = 0;
        const totalToDelete = aSelectedPaths.length;

        aSelectedPaths.forEach((sPath) => {
            oModel.remove(sPath, {
                success: () => {
                    deleteCount++;
                    if (deleteCount === totalToDelete) {
                        MessageBox.success("Selected document(s) have been deleted.");
                    }
                },
                error: (oError: { message: string; }) => {
                    MessageBox.error(`Failed to delete document: ${oError.message}`);
                }
            });
        });
    }




    public async onObjectMatched(event: Route$PatternMatchedEvent): Promise<void> {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
        this.reportID = (event.getParameters() as IBindingParams).arguments.reportID;
        this.customerID = (event.getParameters() as IBindingParams).arguments.customerID;
        const navigation = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        (((this.getOwnerComponent() as Component).getRootControl() as View).byId("sbApp") as ShellBar).setTitle("Report Details");
        (((this.getOwnerComponent() as Component).getRootControl() as View).byId("sbApp") as ShellBar).setShowNavButton(true);
        (this.byId("stTreeDocuments") as SmartTable).rebindTable(true);

        // if (navigation.type == "reload") {
        //     this.onNavToKPIs();
        // }
        //this.setReportChangeHistory();

        // (this.byId("kpiDetailTitle") as Title).setText(this.subKPI + "para." + this.paragraph);
        (this.byId("sfReportDescription") as SmartForm).bindElement("/ReportSet(reportID=guid'" + this.reportID + "')");

        ((this.getView() as View).getModel() as ODataModel).read("/ReportSet(reportID=guid'" + this.reportID + "')", {
            urlParameters: {
                "$expand": "documents",
            },
            success: (data: IKPIs) => {
                //this.subChapterName = data.subchapterName;
                // (this.byId("sbKPIs") as ShellBar).setTitle("Details of " + this.subChapterName);
                (this.byId("oplReportDetails") as ObjectPageLayout).bindElement({
                    path: "/VReportSet(guid'" + (this.reportID) + "')",
                    events: {
                        dataReceived: () => {
                            (this.byId("stDataSources") as SmartTable).rebindTable(true);
                        }
                    }
                });
            }
        });
    }

    public onODataRequestFail(event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    /* ======================================================================================================================= */
    /* Private Functions                                                                                                       */
    /* ======================================================================================================================= */

    // private onMenuAction(event: Menu$ItemSelectEvent){
    //     const action = ((event.getParameter("item")as any).getText()as string);
    //     if(action ==="Change History"){
    //         this.getRouter().navTo("RouteChangeHistory", {
    //         layout: LayoutType.ThreeColumnsMidExpanded,
    //         sectionID: this.sectionID,
    //         kpiID: this.kpiID,
    //         subKPI: this.subKPI,
    //         paragraph: this.paragraph
    //         });
    //     }
    // }

    private async setReportChangeHistory() {
        const user = new UserAPI(this);
        const session = await user.getLoggedOnUser();
        const userSession: IReportHistory = {
            fullName: session.firstname + " " + session.lastname,
            modifiedType: "Regenerate the report",
            modifiedContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Curabitur aliquet quam id dui posuere blandit. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Proin eget tortor risus. Donec sollicitudin molestie malesuada. Nulla quis lorem ut libero malesuada feugiat.",
            avatar: session.firstname.substring(0, 1) + session.lastname.substring(0, 1) as string,
            iconType: "sap-icon://user-edit"
        };
        const creator = new ODataCreateCL<IReportHistory>(this, "ReportHistory");

        creator.setData(userSession);
        creator.create();
    }

    private onCloseColumnLayout() {
        this.getRouter().navTo("RouteReportAdministration", {
            customerID: this.customerID
        });
    }
}

