import BaseController from "./BaseController";
import UserAPI from "../utils/session/UserAPI";
import { UploadCollection$UploadTerminatedEvent } from "sap/m/UploadCollection";
import UploadSet from "sap/m/upload/UploadSet";
import MessageBox from "sap/m/MessageBox";
import PageCL from "../utils/common/PageCL";
import { IPage, Routes } from "../types/global.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Component from "../Component";
import View from "sap/ui/core/mvc/View";
import ShellBar from "sap/f/ShellBar";

/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class Upload extends BaseController implements IPage{

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
public async onObjectMatched(event: Route$PatternMatchedEvent): Promise<void> {
    const oDataModel = this.getComponentModel();
    oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
    (((this.getOwnerComponent() as Component).getRootControl() as View ).byId("sbApp") as ShellBar).setTitle("Upload");
    (((this.getOwnerComponent() as Component).getRootControl() as View ).byId("sbApp") as ShellBar).setShowNavButton(true);

}
public onODataRequestFail(event: Model$RequestFailedEvent): void {
    this.openMessagePopover();
}

}
