import { Suspense } from "react";

import { VideoGrid } from "src/components/Video/VideoGrid";
import { getVideos } from "src/lib/api";

export const metadata = {
  title: "Trending Videos",
};

export const revalidate = 60;
export default async function Home() {
  const videos = await getVideos();
  return (
    <>
      <div className=" px-4">
        <h1 className="text-2xl font-bold mb-4 mt-4 lg:mt-0">
          Trending Videos
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <VideoGrid videos={videos} />
        </Suspense>
      </div>
    </>
  );
}
