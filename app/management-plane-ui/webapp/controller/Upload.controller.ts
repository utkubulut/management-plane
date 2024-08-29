import Controller from "sap/ui/core/mvc/Controller";
import Dialog from "sap/m/Dialog";
import UserAPI from "../utils/session/UserAPI";
import Element from "sap/ui/core/Element";
import { UploadCollection$UploadTerminatedEvent } from "sap/m/UploadCollection";
import UploadSet from "sap/m/upload/UploadSet";
import MessageBox from "sap/m/MessageBox";
export default class Upload extends Controller {

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

}
