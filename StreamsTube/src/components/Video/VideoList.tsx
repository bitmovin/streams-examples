import { FunctionComponent } from "react";

import { VideoCard } from "src/components/Video/VideoCard";
import { Video } from "src/lib/types";

interface VideoListProps {
  videos: Video[];
}

export const VideoList: FunctionComponent<VideoListProps> = ({ videos }) => {
  return (
    <div className="px-4 py-4 space-y-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="transform transition-transform duration-500 hover:scale-103"
        >
          <div className="w-full sm:w-[300px]">
            <VideoCard video={video} />
          </div>
        </div>
      ))}
    </div>
  );
};
