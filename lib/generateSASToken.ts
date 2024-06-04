import{
    BlobServiceClient,
    StorageSharedKeyCredential,
    BlobSASPermissions,
    generateBlobSASQueryParameters,
} from "@azure/storage-blob"

export const containerName="posts"

const accName=process.env.AZURE_STORAGE_NAME
const accKey=process.env.AZURE_STORAGE_ACCOUNT_KEY

if(!accKey || !accName){
    throw new Error("Azure Storage Account required!")
}

const sharedKeyCred=new StorageSharedKeyCredential(accName,accKey)  
const blobServiceClient=new BlobServiceClient(`http://${accName}.blob.core.windows.net`,sharedKeyCred)
async function generateSAStoken(){
    const containerClient=blobServiceClient.getContainerClient(containerName)
    const permissions=new BlobSASPermissions();
    permissions.write=true;
    permissions.create=true;
    permissions.read=true;

    const expDate=new Date();
    expDate.setMinutes(expDate.getMinutes() + 300)
    const sasToken = generateBlobSASQueryParameters(
        {
          containerName: containerClient.containerName,
          permissions: permissions,
          expiresOn: expDate,
        },
        sharedKeyCred
      ).toString();
    
      return sasToken;
    }
    
export default generateSAStoken;