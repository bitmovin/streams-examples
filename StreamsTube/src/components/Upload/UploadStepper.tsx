import { FunctionComponent, useState } from "react";

import { Dropzone } from "src/components/Upload/Dropzone";

interface UploadStepperProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  handleFileUpload: (
    file: File,
    onProgress: (progress: number) => void,
    onComplete: () => void
  ) => void;
}

export const UploadStepper: FunctionComponent<UploadStepperProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  handleFileUpload,
}) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [titleError, setTitleError] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const handleFile = (acceptedFile: File) => {
    setUploadInProgress(true);
    handleFileUpload(
      acceptedFile,
      (progress) => setProgress(progress),
      () => {
        setUploadInProgress(false);
        setStep(3);
      }
    );
  };

  const handleNextClick = () => {
    if (title.trim() === "") {
      setTitleError(true);
    } else {
      setTitleError(false);
      setStep(2);
    }
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description (optional)
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          {titleError && (
            <p className="text-red-500 text-sm mt-2 mb-2">
              Please enter a title before proceeding.
            </p>
          )}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleNextClick}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <Dropzone
            onDrop={handleFile}
            disabled={uploadInProgress}
            progress={progress}
          />
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="text-lg text-green-500">Upload complete!</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={() => {
              setStep(1);
              setTitle("");
              setDescription("");
              setProgress(0);
            }}
          >
            Upload another video
          </button>
        </div>
      )}
    </div>
  );
};
