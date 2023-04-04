import { FunctionComponent, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  onDrop: (acceptedFile: File) => void;
  disabled: boolean;
  progress: number;
}

export const Dropzone: FunctionComponent<DropzoneProps> = ({
  onDrop,
  disabled,
  progress,
}) => {
  const onDropCallback = useCallback(
    (acceptedFiles: string | any[]) => {
      if (acceptedFiles.length > 0) {
        onDrop(acceptedFiles[0]);
      }
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    maxSize: 5 * 1024 * 1024 * 1024, // 5 GB
    accept: { "video/*": [] },
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-8 border-2 border-dashed ${
        isDragActive ? "border-blue-400" : "border-gray-400"
      } rounded-md bg-white text-center hover:border-blue-400 transition-all duration-200 ease-in-out ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <input {...getInputProps()} />
      {progress === 0 && (
        <p className="text-gray-700">
          {isDragActive
            ? "Drop the file here..."
            : "Drag and drop a video file here, or click to select a file"}
        </p>
      )}
      {progress > 0 && (
        <>
          <p className="text-center mt-2">{progress.toFixed(0)}%</p>
          <div className="w-full mt-4">
            <div
              className="bg-blue-500"
              style={{
                height: "4px",
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};
