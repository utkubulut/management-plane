import BaseController from "./BaseController";
import UserAPI from "../utils/session/UserAPI";
import { UploadCollection$UploadTerminatedEvent } from "sap/m/UploadCollection";
import UploadSet from "sap/m/upload/UploadSet";
import MessageBox from "sap/m/MessageBox";
import PageCL from "../utils/common/PageCL";
import { IPage, Routes } from "../types/global.types";
import Model, { Model$RequestFailedEvent } from "sap/ui/model/Model";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import { IReportSet } from "../types/kpis.types";
import Component from "../Component";
import View from "sap/ui/core/mvc/View";
import ShellBar from "sap/f/ShellBar";
import JSONModel from "sap/ui/model/json/JSONModel";
import Table from "sap/m/Table";
import Input from "sap/m/Input";
import Wizard from "sap/m/Wizard";
import WizardStep from "sap/m/WizardStep";
import NavContainer from "sap/m/NavContainer";
import Page from "sap/m/Page";
import ODataCreateCL from "ui5/antares/odata/v2/ODataCreateCL";

/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class Upload extends BaseController implements IPage {
    private _wizard: Wizard;
    private model: JSONModel;
    private _oNavContainer: NavContainer;
    private _oWizardContentPage: Page;

    public onInit() {
        const page = new PageCL<Upload>(this, Routes.UPLOAD);
        page.initialize();
        this._wizard = (this.byId("CreateReportWizard") as Wizard);
        this._oNavContainer = (this.byId("wizardNavContainer") as NavContainer);
        this._oWizardContentPage = (this.byId("wizardContentPage") as Page);
        this.model = new JSONModel();

    }
    private async onFileUpload(event: UploadCollection$UploadTerminatedEvent) {
        const user = new UserAPI(this);
        const session = await user.getLoggedOnUser();
        const uploadItems = (this.byId("usFileAttachments") as UploadSet).getIncompleteItems();
        const storageAccountName = 'susuhudocstore';
        const containerName = 'user-files';
        const sasToken = 'sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacuptfx&se=2025-08-28T14:49:18Z&st=2024-08-28T06:49:18Z&spr=https,http&sig=RrvNxf%2FcfnRkkZzQXHnB0pDZZvlUrUnTIphOKpkeAv8%3D'; // Replace with your actual SAS token

        let successCount = 0;
        let failureCount = 0;

        const promises = uploadItems.map(async (item) => {
            const fileName = item.getProperty("fileName");
            const fileType = item.getProperty("mediaType");
            this.model.setProperty("/fileName", `${fileName}`);
            const blobName = `${session.email}|||${fileName}`;
            const uploadURL = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
            const headers = new Headers();
            headers.append('x-ms-blob-type', 'BlockBlob');
            headers.append('Content-Type', fileType);

            try {
                const response = await fetch(uploadURL, {
                    method: 'PUT',
                    headers: headers,
                    body: item.getFileObject()
                });

                if (response.ok) {
                    successCount++;
                } else {
                    failureCount++;
                }
            } catch (error) {
                failureCount++;
            }
        });

        // Wait for all uploads to complete
        await Promise.all(promises);

        // Show one message based on the result
        if (failureCount === 0) {
            MessageBox.success(`${successCount} file(s) uploaded successfully!`);
        } else if (successCount > 0 && failureCount > 0) {
            MessageBox.warning(`${successCount} file(s) uploaded successfully, but ${failureCount} file(s) failed.`);
        } else {
            MessageBox.error(`All ${failureCount} file(s) failed to upload.`);
        }
    }
    private async getBlobList() {
        const storageAccountName = 'susuhudocstore';
        const containerName = 'user-files';
        const sasToken = 'sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacuptfx&se=2025-08-28T14:49:18Z&st=2024-08-28T06:49:18Z&spr=https,http&sig=RrvNxf%2FcfnRkkZzQXHnB0pDZZvlUrUnTIphOKpkeAv8%3D';

        const listBlobsUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}?restype=container&comp=list&${sasToken}`;

        try {
            const response = await fetch(listBlobsUrl, {
                method: 'GET',
                headers: {
                    'x-ms-version': '2020-10-02'
                }
            });

            if (response.ok) {
                const user = new UserAPI(this);
                const session = await user.getLoggedOnUser();
                const blobData = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(blobData, "application/xml");
                const blobs = xmlDoc.getElementsByTagName("Blob");

                const fileList = [];
                for (let i = 0; i < blobs.length; i++) {
                    if ((blobs[i].getElementsByTagName("Name")[0].textContent as string).split("|||")[0] === session.email) {
                        const fileName = (blobs[i].getElementsByTagName("Name")[0].textContent as string);
                        fileList.push({
                            fileName: fileName.split("|||")[1], // Split the blob name to get the actual file name
                            uploadedBy: fileName.split("|||")[0], // Split to get the user's email
                            url: `https://${storageAccountName}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`
                        });
                    }
                }
                return fileList;
            } else {
                MessageBox.error("Failed to retrieve blob list");
            }
        } catch (error) {
            MessageBox.error("Error fetching blob list: " + error);
        }
    }
    private async loadFiles() {
        const fileList = await this.getBlobList();

        const oModel = new JSONModel();
        oModel.setData({
            files: fileList
        });

        (this.getView() as View).setModel(oModel);
    }
    public async onObjectMatched(event: Route$PatternMatchedEvent): Promise<void> {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
        (((this.getOwnerComponent() as Component).getRootControl() as View).byId("sbApp") as ShellBar).setTitle("Upload");
        (((this.getOwnerComponent() as Component).getRootControl() as View).byId("sbApp") as ShellBar).setShowNavButton(true);
        this.loadFiles();
    }
    public onODataRequestFail(event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }
    public onDeleteSelectedFiles() {
        const oTable = (this.byId("fileTable") as Table);
        const aSelectedItems = oTable.getSelectedItems();
        if (aSelectedItems.length === 0) {
            MessageBox.error("Please select at least one file to delete.");
            return;
        }

        const oModel = ((this.getView() as View).getModel() as JSONModel);
        const aFiles = oModel.getProperty("/files");

        // Get URLs of selected files to delete
        const aSelectedFileUrls = aSelectedItems.map(item => {
            return (item.getBindingContext() as any).getProperty("url"); // anyyy 
        });

        // Filter out the files that are not selected
        const aUpdatedFiles = aFiles.filter((file: { url: any; }) => !aSelectedFileUrls.includes(file.url));

        // Update the model with the remaining files
        oModel.setProperty("/files", aUpdatedFiles);

        // // Optionally, delete the selected files from Azure Blob Storage
        aSelectedFileUrls.forEach(this._deleteFileFromServer.bind(this));

        // // Clear selection
        oTable.removeSelections();
    }
    private additionalInfoValidation() {
        const titleInput = this.byId("reportTitle") as Input;
        const descriptionInput = this.byId("reportDescription") as Input;

        const title = titleInput.getValue();
        const description = descriptionInput.getValue();

        // Validate title and description - mark as error if they are empty
        let isValid = true;

        if (!title.trim()) {  // If title is empty or contains only whitespace
            this.model.setProperty("/reportTitleState", "Error");
            isValid = false;
        } else {
            this.model.setProperty("/reportTitleState", "None");
        }

        if (!description.trim()) {  // If description is empty or contains only whitespace
            this.model.setProperty("/reportDescriptionState", "Error");
            isValid = false;
        } else {
            this.model.setProperty("/reportDescriptionState", "None");
        }

        // Set step status based on validation result
        const reportDetailsStep = this.byId("ReportDetailsStep") as WizardStep;

        if (isValid) {
            this._wizard.validateStep(reportDetailsStep);
        } else {
            this._wizard.invalidateStep(reportDetailsStep);
            this._wizard.setCurrentStep(reportDetailsStep);  // Optionally, return user to the step if validation fails
        }
    }
    private additionalReportInfoValidation() {
        // Fetch values from inputs in the ReportInfoStep
        // const apiTitleInput = this.byId("apiTitle") as Input;
        // const dataDirectoryInput = this.byId("dataDirectory") as Input;
        // const urlAddressInput = this.byId("urlAddress") as Input;
        // const passwordInput = this.byId("passwordID") as Input;

        // const apiTitle = apiTitleInput.getValue();
        // const dataDirectory = dataDirectoryInput.getValue();
        // const urlAddress = urlAddressInput.getValue();
        // const password = passwordInput.getValue();

        // let isValid = true;

        // // Validate API Title
        // if (!apiTitle.trim()) {
        //     this.model.setProperty("/apiTitleState", "Error");
        //     isValid = false;
        // } else {
        //     this.model.setProperty("/apiTitleState", "None");
        // }

        // // Validate Data Directory
        // if (!dataDirectory.trim()) {
        //     this.model.setProperty("/dataDirectoryState", "Error");
        //     isValid = false;
        // } else {
        //     this.model.setProperty("/dataDirectoryState", "None");
        // }

        // // Validate URL Address
        // if (!urlAddress.trim()) {
        //     this.model.setProperty("/urlAddressState", "Error");
        //     isValid = false;
        // } else {
        //     this.model.setProperty("/urlAddressState", "None");
        // }

        // // Validate Password
        // if (!password.trim()) {
        //     this.model.setProperty("/passwordState", "Error");
        //     isValid = false;
        // } else {
        //     this.model.setProperty("/passwordState", "None");
        // }

        // // Get the reference to the ReportInfoStep
        // const reportInfoStep = this.byId("ReportInfoStep") as WizardStep;

        // // Set step status based on validation result
        // if (isValid) {
        //     this._wizard.validateStep(reportInfoStep);
        // } else {
        //     this._wizard.invalidateStep(reportInfoStep);
        //     this._wizard.setCurrentStep(reportInfoStep);  // Optionally return the user to the step if validation fails
        // }
        const reportInfoStep = this.byId("ReportInfoStep") as WizardStep;
        this._wizard.validateStep(reportInfoStep);
    }
    private backToWizardContent() {
        this._oNavContainer.backToPage(this._oWizardContentPage.getId());
    }
    private wizardCompletedHandler () {
        this._oNavContainer.to(this.byId("wizardReviewPage") as Page);
    }
    public handleWizardCancel() {
        this._handleMessageBoxOpen("Are you sure you want to cancel your report?", "warning");
    }
    private async handleWizardCreate(){
        const oModel = ((this.getView()as View).getModel() as JSONModel);
        const oWizardData = oModel.getData();
        const user = new UserAPI(this);
        const session = await user.getLoggedOnUser();
        const oNewReportEntry :IReportSet= {
            reportID: window.crypto.randomUUID(),
            reportTitle: oWizardData.reportTitle,
            reportURL: null,  
            description: oWizardData.reportDescription,
            status: "In Preparation", 
            lastModified: new Date().toISOString(),  
            creator: session.firstname + " " + session.lastname
        };
        const creator = new ODataCreateCL<IReportSet>(this, "ReportSet");
        creator.setData(oNewReportEntry);
        creator.create();
        this.getRouter().navTo("RouteReportAdministration");
        this._handleNavigationToStep(0);
        this._wizard.discardProgress(this._wizard.getSteps()[0], true);
    }
    public editStepOne () {
        this._handleNavigationToStep(0);
    }

    public editStepTwo () {
        this._handleNavigationToStep(1);
    }

    public editStepThree () {
        this._handleNavigationToStep(2);
    }

    private _handleNavigationToStep(iStepNumber: number) {
        const fnAfterNavigate = () => {
            this._wizard.goToStep(this._wizard.getSteps()[iStepNumber], true);
            this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
        };

        this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
        this.backToWizardContent();
    }

    private _handleMessageBoxOpen(sMessage: string, sMessageBoxType: "warning" | "error" | "information" | "success" | "confirm"){
        MessageBox[sMessageBoxType](sMessage, {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: (oAction: string) => {
                if (oAction === MessageBox.Action.YES) {
                    this._handleNavigationToStep(0);
                    this._wizard.discardProgress(this._wizard.getSteps()[0], true);
                }
            }
        });
    }

    private async _deleteFileFromServer(sFileUrl: string) {
        try {
            // Send a DELETE request to Azure Blob Storage
            const response = await fetch(sFileUrl, {
                method: 'DELETE'
            });

            if (response.ok) {
                MessageBox.success(`File deleted successfully from Azure Blob Storage.`);
            } else {
                MessageBox.error(`Failed to delete the file from Azure Blob Storage.`);
            }
        } catch (error) {
            MessageBox.error(`Error occurred while deleting the file: ${error}`);
        }
    }
}
