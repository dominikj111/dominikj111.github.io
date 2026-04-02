import { AUTHOR_TAGLINE, INTRO_SUBTEXT } from '../../config';

interface LandingIntroProps {
  exiting: boolean;
  onDismiss: () => void;
}

export default function LandingIntro({ exiting, onDismiss }: LandingIntroProps) {
  return (
    <div
      className={`pf-intro${exiting ? ' pf-intro--exiting' : ''}`}
      onClick={onDismiss}
      role="button"
      tabIndex={0}
      aria-label="Click to explore"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onDismiss(); }}
    >
      <div className="pf-intro__inner">
        <p className="pf-intro__eyebrow">{AUTHOR_TAGLINE}</p>
        <h1 className="pf-intro__headline">
          Projects.<br />Articles.<br />References.
        </h1>
        <p className="pf-intro__sub">{INTRO_SUBTEXT}</p>
      </div>
      <p className="pf-intro__hint">Click anywhere to explore</p>
    </div>
  );
}
