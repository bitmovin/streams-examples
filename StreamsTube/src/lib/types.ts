import { StreamsVideoResponse } from "@bitmovin/api-sdk";
import StreamsVideoStatus from "@bitmovin/api-sdk/dist/models/StreamsVideoStatus";

type Modify<OriginalType, Modification> = Omit<
  OriginalType,
  keyof Modification
> &
  Modification;

//By default, everything returned by the SDK client is nullable. Here we make the necessary fields not nullable.
export type Video = Modify<
  StreamsVideoResponse,
  {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly createdAt: Date;
    readonly status: StreamsVideoStatus;
  }
>;
