import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/privacy.css';
import { SEO } from '../components/SEO.tsx';
import { seoConfig } from '../utils/seoConfig.ts';

const PrivacyPage = () => {
  const { t } = useLanguage();
  const [isOptedOut, setIsOptedOut] = useState(false);

  useEffect(() => {
    // Check if user has opted out
    const optOutStatus = localStorage.getItem('plausible_ignore') === 'true';
    setIsOptedOut(optOutStatus);
  }, []);

  const handleOptOut = () => {
    if (isOptedOut) {
      // Opt back in
      localStorage.removeItem('plausible_ignore');
      setIsOptedOut(false);
    } else {
      // Opt out
      localStorage.setItem('plausible_ignore', 'true');
      setIsOptedOut(true);
    }
  };

  return (
    <>
      <SEO {...seoConfig.privacy} />
      <div className="privacy-page">
        <div className="privacy-container">
          <h1 className="privacy-title">{t.privacy.title}</h1>

          <section className="privacy-section">
            <h2>{t.privacy.whatWeCollect}</h2>
            <p>{t.privacy.anonymousDescription}</p>
            <ul className="privacy-list">
              <li>{t.privacy.noPersonalData}</li>
              <li>{t.privacy.noCookies}</li>
              <li>{t.privacy.noTracking}</li>
              <li>{t.privacy.gdprCompliant}</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>{t.privacy.eventsTracked}</h2>
            <p>{t.privacy.eventsDescription}</p>
            <ul className="privacy-list events-list">
              <li>
                <strong>search_performed</strong> - {t.privacy.eventSearch}
              </li>
              <li>
                <strong>result_click</strong> - {t.privacy.eventClick}
              </li>
              <li>
                <strong>favorite_add</strong> - {t.privacy.eventFavorite}
              </li>
              <li>
                <strong>album_of_day_view</strong> - {t.privacy.eventGift}
              </li>
            </ul>
          </section>

          <section className="privacy-section opt-out-section">
            <h2>{t.privacy.optOutTitle}</h2>
            <p>{t.privacy.optOutDescription}</p>

            <div className="opt-out-control">
              <button
                className={`opt-out-button ${isOptedOut ? 'opted-out' : 'opted-in'}`}
                onClick={handleOptOut}
              >
                {isOptedOut ? (
                  <>
                    <span className="opt-out-icon">✓</span>
                    {t.privacy.optedOut}
                  </>
                ) : (
                  <>
                    <span className="opt-out-icon">👁️</span>
                    {t.privacy.optIn}
                  </>
                )}
              </button>

              <p className="opt-out-status">
                {isOptedOut ? t.privacy.statusOptedOut : t.privacy.statusOptedIn}
              </p>
            </div>
          </section>

          <section className="privacy-section">
            <h2>{t.privacy.learnMore}</h2>
            <p>
              {t.privacy.plausibleInfo}{' '}
              <a
                href="https://plausible.io/privacy-focused-web-analytics"
                target="_blank"
                rel="noopener noreferrer"
                className="privacy-link"
              >
                Plausible Analytics
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
