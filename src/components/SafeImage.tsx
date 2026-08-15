import React, { useState } from 'react';
import { ItemCategory } from '../types';
import { getProductFallbackImage } from '../data/productImages';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  title?: string;
  category?: ItemCategory;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  title,
  category,
  fallbackSrc,
  className = '',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc || getProductFallbackImage(title || alt, category));
  const [hasError, setHasError] = useState(false);

  // If the src prop changes dynamically, reset the error state and source
  React.useEffect(() => {
    setCurrentSrc(src || fallbackSrc || getProductFallbackImage(title || alt, category));
    setHasError(false);
  }, [src, fallbackSrc, title, alt, category]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallback = fallbackSrc || getProductFallbackImage(title || alt, category);
      setCurrentSrc(fallback);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
