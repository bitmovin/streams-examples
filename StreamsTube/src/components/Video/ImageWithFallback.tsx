"use client";

import Image, { ImageProps } from "next/image";
import React, { useEffect, useState } from "react";

interface Props extends ImageProps {
  fallbackSrc: string;
}

const ImageWithFallback = ({ fallbackSrc, src, alt, ...props }: Props) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <Image
      onError={() => setError(true)}
      src={error ? fallbackSrc : src}
      alt={alt}
      {...props}
    />
  );
};

export default ImageWithFallback;
