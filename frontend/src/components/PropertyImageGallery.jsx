import { useState, useEffect, useRef } from 'react';
import { parsePhotos } from '../utils/photos';

export default function PropertyImageGallery({ photosRaw }) {
  const photos = parsePhotos(photosRaw);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const lightboxRef = useRef(null);

  // tabIndex={-1} makes the div focusable so keydown events reach it.
  // Without this attribute the div cannot receive keyboard focus and
  // the Escape/arrow handlers never fire.
  useEffect(() => {
    if (lightboxOpen) lightboxRef.current?.focus();
  }, [lightboxOpen]);

  if (photos.length === 0) {
    return <div className="gallery-empty">No photos available</div>;
  }

  function handleLightboxKey(e) {
    if (e.key === 'Escape') setLightboxOpen(false);
    if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % photos.length);
    if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
  }

  function shiftPhoto(delta, e) {
    e.stopPropagation();
    setActiveIndex((i) => (i + delta + photos.length) % photos.length);
  }

  return (
    <>
      <div className="gallery">
        <div className="gallery-main" onClick={() => setLightboxOpen(true)} role="button" tabIndex={0} aria-label="Open photo gallery">
          <img src={photos[activeIndex]} alt="Property photo" />
          <span className="gallery-hint">Click to expand</span>
        </div>
        {photos.length > 1 && (
          <div className="gallery-thumbnails">
            {photos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className={i === activeIndex ? 'thumb-active' : ''}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="lightbox"
          ref={lightboxRef}
          tabIndex={-1}
          onKeyDown={handleLightboxKey}
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Close lightbox">×</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => shiftPhoto(-1, e)} aria-label="Previous photo">‹</button>
          <img src={photos[activeIndex]} alt="Property photo" />
          <button className="lightbox-nav lightbox-next" onClick={(e) => shiftPhoto(1, e)} aria-label="Next photo">›</button>
          <div className="lightbox-counter">{activeIndex + 1} / {photos.length}</div>
        </div>
      )}
    </>
  );
}
