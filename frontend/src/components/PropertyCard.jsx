import { Link } from 'react-router-dom';
import PropertyImageCarousel from './PropertyImageCarousel';

export default function PropertyCard({ property }) {
  const {
    L_ListingID,
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

  const price = Number(L_SystemPrice);

  return (
    <Link to={`/property/${L_ListingID}`} className="property-card">
      <div className="card-photo">
        <PropertyImageCarousel photosRaw={L_Photos} />
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
    </Link>
  );
}
