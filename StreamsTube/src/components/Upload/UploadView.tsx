"use client";

import { useRouter } from "next/navigation";
import React, { FunctionComponent, useState } from "react";

import { UploadStepper } from "src/components/Upload/UploadStepper";
import { uploadVideo } from "src/lib/api";

export const UploadView: FunctionComponent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleFileUpload = (
    file: File,
    onProgress: (progress: number) => void,
    onComplete: () => void
  ) => {
    uploadVideo(file, title, description, onProgress, (videoId) => {
      router.push(`/video/${videoId}`);
      onComplete();
    });
  };

  return (
    <div className="container mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6">Upload a Video</h1>
      <UploadStepper
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        handleFileUpload={handleFileUpload}
      />
    </div>
  );
};
