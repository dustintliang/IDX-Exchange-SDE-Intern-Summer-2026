const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function PropertyMap({ lat, lng, address }) {
  if (!lat || !lng) return null;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="detail-section">
      <h2>Location</h2>
      {MAPS_KEY ? (
        <iframe
          className="property-map"
          src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${lat},${lng}&zoom=15`}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map for ${address}`}
        />
      ) : (
        <p className="muted">
          Map unavailable — add <code>VITE_GOOGLE_MAPS_API_KEY</code> to <code>frontend/.env</code>.
        </p>
      )}
      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="directions-link">
        Get Directions ↗
      </a>
    </div>
  );
}
