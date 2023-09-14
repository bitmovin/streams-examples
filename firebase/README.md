# Streams Firebase Example
This example demonstrates how to set up Firebase Functions to automatically create a Stream after a video was uploaded to the Firebase Storage.

## Prerequisites

- Node.js V18 and npm / yarn installed
- A valid [Bitmovin API key](https://bitmovin.com/dashboard/account) (You can sign up for a free trial [here](https://bitmovin.com/dashboard/signup))
- Firebase [Project](https://console.firebase.google.com/)
- Firebase [CLI Tool](https://firebase.google.com/docs/cli)

## Steps
### 1. Install dependencies
```console
cd functions
npm install
```
or
```console
cd functions
yarn
```
### 2. Set up the firebase CLI
Run the following command and select your project.
```
firebase use --add
```
### 3. Deploy

Go to the index.js file and change the **region** to the region of your bucket (default: europe-west1).

```
firebase deploy
```

> **_NOTE:_**  The secret manager has to be activated in your project before you deploy your function. To activate please visit [secret manager](https://console.cloud.google.com/security/secret-manager).

You wil be prompted to enter your **Bitmovin Api key**. 

To change the Bitmovin Api key go to your [secret manager](https://console.cloud.google.com/security/secret-manager) and delete the old key

> **_NOTE:_**  Make sure the service account has access to the secret, otherwise you will get permission denied error on requesting the api key. To give the service account access, go to the [secret manager](https://console.cloud.google.com/security/secret-manager) select BITMOVIN_API_KEY and add a principal with the used service account and the role: secretmanager.secretAccessor.

### 4. Upload a video

Go to your Firebase Storage and upload a video. After the upload was successful, a Stream will be created and the Stream Id will be added to the Metadata of the video.