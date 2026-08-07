import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPropertyDetail, fetchOpenHouses } from '../api/client';
import PropertyImageGallery from '../components/PropertyImageGallery';
import PropertyMap from '../components/PropertyMap';

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return m === 0 ? `${h12} ${ampm}` : `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function OpenHousesList({ openHouses }) {
  if (openHouses.length === 0) {
    return (
      <div className="detail-section">
        <h2>Open Houses</h2>
        <p className="muted">No open houses scheduled.</p>
      </div>
    );
  }

  return (
    <div className="detail-section">
      <h2>Open Houses</h2>
      <ul className="openhouse-list">
        {openHouses.map((oh) => {
          // Debug challenge: remarks live inside the all_data JSON blob
          let remarks = null;
          try {
            const data = JSON.parse(oh.all_data);
            remarks = data.OpenHouseRemarks || null;
          } catch {
            // malformed JSON — skip remarks
          }

          const date = new Date(oh.OpenHouseDate).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            timeZone: 'UTC',
          });

          return (
            <li key={`${oh.OpenHouseDate}-${oh.OH_StartTime}`} className="openhouse-item">
              <div className="oh-date">{date}</div>
              <div className="oh-time">{formatTime(oh.OH_StartTime)} – {formatTime(oh.OH_EndTime)}</div>
              {remarks && <div className="oh-remarks">"{remarks}"</div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchPropertyDetail(id), fetchOpenHouses(id)])
      .then(([prop, oh]) => {
        setProperty(prop);
        setOpenHouses(oh);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="state-message">
        <div className="spinner" />
        <span>Loading property…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="state-message error">
          <strong>Could not load this property.</strong>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const {
    L_Address, L_City, L_State, L_Zip,
    L_SystemPrice, L_Keyword2, LM_Dec_3, LM_Int2_3, YearBuilt,
    L_Photos, LMD_MP_Latitude, LMD_MP_Longitude, L_Remarks,
  } = property;

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to listings</button>

      <PropertyImageGallery photosRaw={L_Photos} />

      <div className="detail-body">
        <div className="detail-price">${Number(L_SystemPrice).toLocaleString()}</div>
        <div className="detail-address">{L_Address}</div>
        <div className="detail-location">{L_City}, {L_State} {L_Zip}</div>

        <div className="detail-stats">
          <div className="stat">
            <span className="stat-value">{L_Keyword2 ?? '—'}</span>
            <span className="stat-label">Beds</span>
          </div>
          <div className="stat">
            <span className="stat-value">{LM_Dec_3 ?? '—'}</span>
            <span className="stat-label">Baths</span>
          </div>
          <div className="stat">
            <span className="stat-value">{LM_Int2_3 ? Number(LM_Int2_3).toLocaleString() : '—'}</span>
            <span className="stat-label">Sq Ft</span>
          </div>
          {YearBuilt && (
            <div className="stat">
              <span className="stat-value">{YearBuilt}</span>
              <span className="stat-label">Year Built</span>
            </div>
          )}
        </div>

        {L_Remarks && (
          <div className="detail-section">
            <h2>Description</h2>
            <p className="detail-remarks">{L_Remarks}</p>
          </div>
        )}

        <PropertyMap
          lat={LMD_MP_Latitude}
          lng={LMD_MP_Longitude}
          address={`${L_Address}, ${L_City}, ${L_State}`}
        />

        <OpenHousesList openHouses={openHouses} />
      </div>
    </div>
  );
}
