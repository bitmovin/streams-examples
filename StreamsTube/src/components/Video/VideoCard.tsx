import Link from "next/link";
import { FunctionComponent } from "react";

import ImageWithFallback from "src/components/Video/ImageWithFallback";
import { Video } from "src/lib/types";

interface VideoCardProps {
  video: Video;
}

export const VideoCard: FunctionComponent<VideoCardProps> = ({ video }) => {
  return (
    <Link
      href={`/video/${video.id}`}
      className="block relative group min-h-[180px]"
    >
      <div className="relative pb-[56.25%]">
        <ImageWithFallback
          src={`https://streams.bitmovin.com/${video.id}/poster.png`}
          fallbackSrc={
            "https://via.placeholder.com/320x180/87ceeb/FFFFFF.png?text=Thumbnail+not+available"
          }
          alt={video.title}
          height={1920}
          width={1080}
          loading="lazy"
          className="absolute h-full w-full object-cover rounded-md transform transition-transform duration-300 group-hover:scale-105 shadow-md group-hover:shadow-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-200 group-hover:opacity-60 rounded-md"></div>
      </div>
      <div className="mt-2">
        <h2 className="text-lg font-semibold line-clamp-2 h-[3.5rem] overflow-hidden">
          {video.title}
        </h2>
      </div>
    </Link>
  );
};
