function parsePhotos(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export default function PropertyCard({ property }) {
  const {
    L_Address,
    L_City,
    L_State,
    L_Zip,
    L_SystemPrice,
    L_Keyword2,
    LM_Dec_3,
    LM_Int2_3,
    L_Photos,
  } = property;

  const photos = parsePhotos(L_Photos);
  const firstPhoto = photos[0] ?? null;
  const price = Number(L_SystemPrice);

  return (
    <div className="property-card">
      <div className="card-photo">
        {firstPhoto ? (
          <img
            src={firstPhoto}
            alt={L_Address}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="no-photo" style={{ display: firstPhoto ? 'none' : 'flex' }}>
          No Photo
        </div>
      </div>
      <div className="card-body">
        <div className="card-price">
          ${price > 0 ? price.toLocaleString() : '—'}
        </div>
        <div className="card-address">{L_Address}</div>
        <div className="card-location">
          {L_City}, {L_State} {L_Zip}
        </div>
        <div className="card-details">
          <span>{L_Keyword2 ?? '—'} bd</span>
          <span className="dot">·</span>
          <span>{LM_Dec_3 ?? '—'} ba</span>
          <span className="dot">·</span>
          <span>{LM_Int2_3 ? Number(LM_Int2_3).toLocaleString() + ' sqft' : '— sqft'}</span>
        </div>
      </div>
    </div>
  );
}
