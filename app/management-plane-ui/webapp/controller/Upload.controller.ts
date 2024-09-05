import BaseController from "./BaseController";
import UserAPI from "../utils/session/UserAPI";
import { UploadCollection$UploadTerminatedEvent } from "sap/m/UploadCollection";
import UploadSet from "sap/m/upload/UploadSet";
import MessageBox from "sap/m/MessageBox";
import PageCL from "../utils/common/PageCL";
import { IPage, Routes } from "../types/global.types";
import Model, { Model$RequestFailedEvent } from "sap/ui/model/Model";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Component from "../Component";
import View from "sap/ui/core/mvc/View";
import ShellBar from "sap/f/ShellBar";
import JSONModel from "sap/ui/model/json/JSONModel";
import { table } from "sap/m/library";
import Table from "sap/m/Table";

/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class Upload extends BaseController implements IPage {

    public onInit() {
        const page = new PageCL<Upload>(this, Routes.Upload);
        page.initialize();
        
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
        const oTable = (this.byId("fileTable")as Table);
        const aSelectedItems = oTable.getSelectedItems();
        if (aSelectedItems.length === 0) {
            MessageBox.error("Please select at least one file to delete.");
            return;
        }
    
        const oModel = ((this.getView()as View).getModel() as JSONModel);
        const aFiles = oModel.getProperty("/files");
    
        // Get URLs of selected files to delete
        const aSelectedFileUrls = aSelectedItems.map(item => {
            return (item.getBindingContext() as any).getProperty("url"); // anyyy 
        });
    
        // Filter out the files that are not selected
        const aUpdatedFiles = aFiles.filter((file: { url: any; })  => !aSelectedFileUrls.includes(file.url));
    
        // Update the model with the remaining files
        oModel.setProperty("/files", aUpdatedFiles);
    
        // // Optionally, delete the selected files from Azure Blob Storage
        aSelectedFileUrls.forEach(this._deleteFileFromServer.bind(this));
    
        // // Clear selection
        oTable.removeSelections();
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
