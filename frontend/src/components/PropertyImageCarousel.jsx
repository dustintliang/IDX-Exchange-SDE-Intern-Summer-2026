import { useState } from 'react';
import { parsePhotos } from '../utils/photos';

export default function PropertyImageCarousel({ photosRaw }) {
  const photos = parsePhotos(photosRaw);
  const [index, setIndex] = useState(0);

  if (photos.length === 0) {
    return <div className="no-photo">No Photo</div>;
  }

  function prev(e) {
    e.stopPropagation();
    e.preventDefault();
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }

  function next(e) {
    e.stopPropagation();
    e.preventDefault();
    setIndex((i) => (i + 1) % photos.length);
  }

  return (
    <div className="carousel">
      <img
        src={photos[index]}
        alt=""
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      {photos.length > 1 && (
        <>
          <button className="carousel-btn carousel-prev" onClick={prev} aria-label="Previous photo">‹</button>
          <button className="carousel-btn carousel-next" onClick={next} aria-label="Next photo">›</button>
          <span className="carousel-counter">{index + 1} / {photos.length}</span>
        </>
      )}
    </div>
  );
}
