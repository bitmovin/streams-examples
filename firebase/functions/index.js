const {onObjectFinalized} = require("firebase-functions/v2/storage");
const {initializeApp} = require("firebase-admin/app");
const {getStorage, getDownloadURL} = require("firebase-admin/storage");
const {setGlobalOptions} = require("firebase-functions/v2");
const {defineSecret} = require("firebase-functions/params");
const logger = require("firebase-functions/logger");

const apiKey = defineSecret("BITMOVIN_API_KEY");

// Replace with defineString("REGION", {default: "europe-west1"});
// after google fixes the type mismatch issue: https://github.com/firebase/firebase-tools/pull/6205
const region = "europe-west1"; // Set the same region as your bucket

initializeApp();
setGlobalOptions({region});

exports.createBitmovinStream = onObjectFinalized(
    {secrets: [apiKey]},
    async (event) => {
      const fileBucket = event.data.bucket; // Bucket name containing the file.
      const filePath = event.data.name; // File path in the bucket.
      const contentType = event.data.contentType; // File content type.

      // Exit if this is triggered on a file that is not an image.
      if (!contentType.startsWith("video/")) {
        return logger.log("Uploaded file is not a video");
      }

      const storage = getStorage();
      const bucket = storage.bucket(fileBucket);
      const videoFile = bucket.file(filePath);
      // Create a publically accessable download URL
      const url = await getDownloadURL(videoFile);

      const createStream = async ()=>{
        const apiUrl = "https://api.bitmovin.com/v1/streams/video";
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "X-Api-Key": apiKey.value(),
            "accept": "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            assetUrl: url,
            title: `Firebase stream for ${videoFile.name}`,
            description: "Stream created by Firebase functions",
          }),
        });

        return response.json();
      };

      try {
        const streamResponse = await createStream();
        if (streamResponse.status !== "SUCCESS") {
          throw Error("Something went wrong during creation of the stream.");
        }
        const streamId = streamResponse.data.result.id;
        await videoFile.setMetadata({metadata: {
          "Stream ID": streamId,
          "Stream URL": `https://dashboard.bitmovin.com/streams/${streamId}`,
        }});
        logger.debug(`StreamId ${streamId} set as Metadata`);
      } catch (error) {
        logger.error(error);
      }
    });
