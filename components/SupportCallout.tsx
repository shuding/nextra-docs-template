'use client';

import styles from './SupportCallout.module.css';

export default function SupportCallout() {
  return (
    <div className={styles.callout} role="note" aria-label="Support">
      <span className={styles.icon} aria-hidden="true">
        ℹ️
      </span>
      <p className={styles.text}>
        Reach out to{' '}
        <a href="mailto:support@cardinalhq.io">support@cardinalhq.io</a> for support or to ask
        questions not answered in our documentation.
      </p>
    </div>
  );
}
