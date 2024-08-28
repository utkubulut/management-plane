import Controller from "sap/ui/core/mvc/Controller";
import Dialog from "sap/m/Dialog";
import UserAPI from "../utils/session/UserAPI";
import Element from "sap/ui/core/Element";
import { UploadCollection$UploadTerminatedEvent } from "sap/m/UploadCollection";
import UploadSet from "sap/m/upload/UploadSet";
export default class Upload extends Controller {
    private _oDialog: Dialog | null = null;

    


    private async onFileUpload(event:UploadCollection$UploadTerminatedEvent) {
        const user = new UserAPI(this);
        const session = await user.getLoggedOnUser();
        const uploadItems  = (this.byId("usFileAttachments") as UploadSet).getIncompleteItems();
        const storageAccountName = 'susuhudocstore';  
        const containerName = 'user-files';
        const sasToken = 'sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacuptfx&se=2025-08-28T14:49:18Z&st=2024-08-28T06:49:18Z&spr=https,http&sig=RrvNxf%2FcfnRkkZzQXHnB0pDZZvlUrUnTIphOKpkeAv8%3D'; // Replace with your actual SAS token
        
        uploadItems.forEach(async (item) => {
            const fileName=item.getProperty("fileName");
            const fileType = item.getProperty("mediaType");
            const blobName = `${session.name}|||${fileName}`;
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
                    console.log('File uploaded successfully!');
                } else {
                    console.error(`File upload failed: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.error('Error during file upload:', error);
            }

        });
            
        
        //this.uploadFile(session.firstname, file);

    }
    private async uploadFile(userName: string, file: File) {
        // Replace with your actual values
        const storageAccountName = 'susuhudocstore';  
        const containerName = 'user-files';
        const sasToken = 'sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacuptfx&se=2025-08-28T14:49:18Z&st=2024-08-28T06:49:18Z&spr=https,http&sig=RrvNxf%2FcfnRkkZzQXHnB0pDZZvlUrUnTIphOKpkeAv8%3D'; // Replace with your actual SAS token
        
        // Create the blob name with a custom delimiter
        const blobName = `${userName}|||${file.name}`;
        
        // Construct the full URL to the blob
        const url = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
        
        // Set the headers for the PUT request
        const headers = new Headers();
        headers.append('x-ms-blob-type', 'BlockBlob');
        headers.append('Content-Type', file.type);
        
        // Perform the PUT request to upload the file
        
    }

}
