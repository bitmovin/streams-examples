import BitmovinApi, {
  DirectFileUploadInput,
  PaginationResponse,
  StreamsVideoCreateRequest,
} from "@bitmovin/api-sdk";
import StreamsVideoStatus from "@bitmovin/api-sdk/dist/models/StreamsVideoStatus";

import { Video } from "src/lib/types";

const BITMOVIN_API_KEY = process.env.NEXT_PUBLIC_BITMOVIN_API_KEY;

if (!BITMOVIN_API_KEY) {
  throw new Error(
    "API key is not defined. Please set the NEXT_PUBLIC_MY_API_KEY environment variable."
  );
}

const bitmovinApi = new BitmovinApi({ apiKey: BITMOVIN_API_KEY });

/**
 * Uploads a video file using the Bitmovin API, creates a stream with the uploaded video, and calls
 * the provided `onProgress` and `onSuccess` callbacks to report progress and success.
 *
 * @param {File} file - The video file to be uploaded.
 * @param {string} title - The title of the video.
 * @param {string} description - The description of the video.
 * @param {(progress: number) => void} onProgress - A callback function to report upload progress, called with a number representing the percentage of completion.
 * @param {(videoId: string) => void} onSuccess - A callback function to report the success of the upload, called with the videoId of the created stream.
 */
export async function uploadVideo(
  file: File,
  title: string,
  description: string,
  onProgress: (progress: number) => void,
  onSuccess: (videoId: string) => void
) {
  // 1. Generate URL for Direct File Upload
  const directFileInput =
    await bitmovinApi.encoding.inputs.directFileUpload.create(
      new DirectFileUploadInput()
    );

  if (!directFileInput.uploadUrl) {
    return;
  }

  // 2. Upload the file to the generated URL
  const request = new XMLHttpRequest();
  request.upload.addEventListener("progress", (event) => {
    if (event.lengthComputable) {
      const progress = (event.loaded / event.total) * 100;
      onProgress(progress);
    }
  });

  request.addEventListener("load", async () => {
    // Handle successful upload, parse the response, and call onSuccess with the videoId
    if (request.status >= 200 && request.status < 300) {
      // 3. Create a Stream with the uploaded video
      const streamRequest = new StreamsVideoCreateRequest({
        assetUrl: `https://api.bitmovin.com/v1/encoding/inputs/direct-file-upload/${directFileInput.id}`,
        title,
        description,
      });
      const stream = (await bitmovinApi.streams.video.create(
        streamRequest
      )) as Video;
      // 4. Call onSuccess callback with videoId
      onSuccess(stream.id);
    } else {
      console.error("Upload failed:", request.responseText);
    }
  });

  request.open("PUT", directFileInput.uploadUrl);
  request.overrideMimeType(file.type);
  request.send(file);
}

/**
 * Fetches a single page of video streams using the Bitmovin API.
 *
 * @param {number} offset - The starting index from which to fetch items.
 * @param {number} limit - The number of items to fetch per page.
 * @returns {Promise<PaginationResponse<Video> | null>} A promise that resolves to a `PaginationResponse` object containing `Video` items if successful, or `null` if there is an error.
 */
async function fetchPage(offset: number, limit: number) {
  try {
    return (await bitmovinApi.streams.video.list({
      offset,
      limit,
    })) as PaginationResponse<Video>;
  } catch (error) {
    console.error("Error fetching video streams:", error);
    return null;
  }
}

/**
 * Fetches all available pages of items using the `fetchPage` function.
 *
 * @param {number} [offset=0] - The starting index from which to fetch items.
 * @param {number} [limit=25] - The number of items to fetch per page.
 * @returns {Promise<Video[]>} A promise that resolves to an array containing all the fetched items across all pages.
 */
async function fetchAllPages(offset = 0, limit = 25) {
  // Fetch the first page to determine the total number of items
  const firstPage = await fetchPage(offset, limit);

  if (!firstPage?.items || !firstPage?.totalCount) {
    return [];
  }

  const { totalCount } = firstPage;
  const remainingPagesCount = Math.ceil((totalCount - limit) / limit);

  // Fetch the remaining pages concurrently
  const remainingPagesPromises = Array.from(
    { length: remainingPagesCount },
    (_, i) => fetchPage((i + 1) * limit, limit)
  );

  const remainingPagesResponses = await Promise.all(remainingPagesPromises);

  // Combine all the fetched items into a single array
  return [
    ...firstPage.items,
    ...remainingPagesResponses.flatMap((response) => response?.items || []),
  ];
}

/**
 * Retrieves all published videos and sorts them by date in descending order.
 *
 * @returns {Promise<Video[]>} A promise that resolves to an array of `Video` objects, sorted by their creation date in descending order.
 */
export async function getVideos() {
  const allItems = await fetchAllPages();

  // Filter out the published videos, sort by date, and return the result
  return allItems
    .filter((stream) => stream.status === StreamsVideoStatus.PUBLISHED)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Fetches the video information for a given video ID using the Bitmovin API.
 *
 * @param {string} id - The unique identifier of the video to retrieve.
 * @returns {Promise<Video | null>} A promise that resolves to the `Video` object if found, or `null` if there is an error or the video is not found.
 */
export async function getVideo(id: string): Promise<Video | null> {
  try {
    return (await bitmovinApi.streams.video.get(id)) as Video;
  } catch (error) {
    return null;
  }
}

/**
 * Fetches a random set of published videos from the available video collection.
 *
 * This function first fetches the total number of available items from the
 * first page, calculates the total number of pages, and then randomly selects
 * a page index to fetch. If the number of fetched items is less than the
 * desired count, additional items are fetched from the next page(s). Only
 * videos with a stream.status of StreamsVideoStatus.PUBLISHED are returned.
 *
 * @param {number} [itemCount=5] - The number of videos to fetch (default is 5).
 * @returns {Promise<Video[]>} A promise that resolves to an array of randomly
 * selected published videos. Returns an empty array if there are no videos or if an error occurs.
 */
export async function getRandomVideos(itemCount = 5) {
  // Fetch the first page to determine the total number of items
  const firstPage = await fetchPage(0, 1);

  if (!firstPage?.totalCount) {
    return [];
  }

  const { totalCount } = firstPage;
  const totalPages = Math.ceil(totalCount / itemCount);

  // Choose a random page index
  const randomPageIndex = Math.floor(Math.random() * totalPages);

  // Fetch the random page
  const randomPage = await fetchPage(randomPageIndex * itemCount, itemCount);

  // Filter the items to only include published videos
  const publishedItems =
    randomPage?.items?.filter(
      (item) => item.status === StreamsVideoStatus.PUBLISHED
    ) || [];

  // Check if the fetched items are less than the desired count
  const fetchedItemsCount = publishedItems.length;
  if (fetchedItemsCount < itemCount) {
    // Calculate the number of additional items needed
    const additionalItemsNeeded = itemCount - fetchedItemsCount;

    // Fetch additional items from the next page(s)
    const additionalItems = await fetchAllPages(
      (randomPageIndex + 1) * itemCount,
      additionalItemsNeeded
    );

    // Filter the additional items to only include published videos
    const publishedAdditionalItems = additionalItems.filter(
      (item) => item.status === StreamsVideoStatus.PUBLISHED
    );

    // Combine the fetched items and additional items
    return [
      ...publishedItems,
      ...publishedAdditionalItems.slice(0, additionalItemsNeeded),
    ];
  }

  return publishedItems;
}
