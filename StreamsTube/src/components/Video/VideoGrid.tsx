import { FunctionComponent } from "react";

import { VideoCard } from "src/components/Video/VideoCard";
import { Video } from "src/lib/types";

interface VideoListProps {
  videos: Video[];
}

export const VideoGrid: FunctionComponent<VideoListProps> = ({ videos }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="w-full">
          <VideoCard video={video} />
        </div>
      ))}
    </div>
  );
};
