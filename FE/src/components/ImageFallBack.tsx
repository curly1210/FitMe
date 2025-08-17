/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import placehoderImage from "../assets/images/No-Image-Placeholder.svg.png";

interface ImageWithFallbackProps {
  src: string;
  alt?: string;
  width?: any;
  height?: any;
  attribute?: string;
  onClick?: () => void;
}

function ImageWithFallback({
  src,
  alt = "ảnh",
  width = 80,
  height = 80,
  attribute = "object-contain",
  onClick,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      onError={() => setImgSrc(placehoderImage)}
      style={{ width, height }}
      // width={width}
      // height={height}
      loading="lazy"
      alt={alt}
      onClick={onClick}
      className={` object-center ${attribute}`}
    />
  );
}

export default ImageWithFallback;
