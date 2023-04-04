import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { DOMAttributes, Suspense } from "react";

import { VideoList } from "src/components/Video/VideoList";
import { getRandomVideos, getVideo } from "src/lib/api";

declare global {
  export namespace JSX {
    interface IntrinsicElements {
      "bitmovin-stream": DOMAttributes<{
        "stream-id": string;
        autoplay?: boolean;
        muted?: boolean;
        poster?: string;
      }>;
    }
  }
}

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  const video = await getVideo(id);

  if (!video) {
    notFound();
  }

  return { title: video.title };
}

interface Props {
  params: {
    id: string;
  };
}
export default async function VideoPage({ params: { id } }: Props) {
  const videos = await getRandomVideos();
  const video = await getVideo(id);

  if (!video) {
    notFound();
  }

  const formattedDate = video.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <Script
        type="module"
        src={"https://streams.bitmovin.com/js/component.js"}
      />
      <div className="flex flex-wrap">
        <div className="w-full lg:w-2/3 px-4 py-4">
          <div className="aspect-video mb-4 overflow-hidden rounded-md">
            <bitmovin-stream stream-id={id} />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-1">{video.title}</h1>
              <p className="text-sm text-gray-600">{formattedDate}</p>
            </div>
          </div>
          <p className="text-lg mt-4">{video?.description}</p>
        </div>
        <div className="w-full lg:w-1/3 lg:pl-6 px-4 py-4">
          <h2 className="text-2xl font-bold mb-4">Random Videos</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <VideoList videos={videos.filter((v) => v.id !== id)} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
