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
        <p className="pf-intro__eyebrow">Software Engineer</p>
        <h1 className="pf-intro__headline">
          Projects.<br />Articles.<br />References.
        </h1>
        <p className="pf-intro__sub">
          A knowledge hub for things I build, write about, and find worth sharing.
          Identity emerges from the work.
        </p>
      </div>
      <p className="pf-intro__hint">Click anywhere to explore</p>
    </div>
  );
}
