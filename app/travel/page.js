'use client'

import Nav from '../components/Nav'
import styles from './page.module.css'

export default function Travel() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.content}>
            <p className={styles.date}>December 31, 2026</p>
            <h1 className={styles.kicker}>A New Year&apos;s Eve Reception</h1>

            <div className={styles.spacer} />

            <h2 className={styles.statement}>
              Ciera &amp; Zach request your company as we celebrate our marriage with family and friends.
            </h2>

            <div className={styles.bodyBlock}>
              <p>We&apos;ve been looking forward to this one for a while.</p>
              <p>Attire: creative black-tie encouraged. Dress in what makes you feel so good that you can&apos;t stop dancing.</p>
              <p><a href="https://web.telegram.org/when-where" className={styles.link}>Full Details +</a></p>
            </div>
          </div>
        </section>

        <section className={styles.detailsSection}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailsColumn}>
              <p className={styles.eyebrow}>When</p>

              <div className={styles.detailBlock}>
                <h2 className={styles.detailHeading}>Thursday,<br />December 31, 2026</h2>
                <div className={styles.detailSpacer} />
                <p className={styles.detailCopy}>Dinner: 7:00pm—9:00pm</p>
                <p className={styles.detailCopy}>Party: 9:00pm—1:30am</p>
                <p className={styles.detailLinkWrap}><a href="https://web.telegram.org/when-where" className={styles.detailLink}>Full Details +</a></p>
              </div>
            </div>

            <div className={styles.detailsColumn}>
              <p className={styles.eyebrow}>Where</p>

              <div className={styles.detailBlock}>
                <h2 className={styles.detailHeading}>Topside &amp; Garden Room<br />at Hotel Revival</h2>
                <div className={styles.detailSpacer} />
                <p className={styles.detailCopy}>101 W Monument St,</p>
                <p className={styles.detailCopy}>Baltimore, MD 21201</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.accommodationsSection}>
          <div className={styles.accommodationsContent}>
            <p className={styles.accommodationsEyebrow}>Accommodations</p>
            <h2 className={styles.accommodationsTitle}>Hotel Revival</h2>
            <p className={styles.accommodationsBody}>We&apos;ve reserved a block of rooms for Thursday, December 31st at Hotel Revival in Mt. Washington, Baltimore.</p>
            <p className={styles.accommodationsBody}>If you&apos;re planning to extend your stay beyond Thursday evening, call Hotel Revival and mention the Bosson New Years Eve Reception when you reserve.</p>
            <p className={styles.accommodationsMeta}>101 W Monument St,<br />Baltimore, MD 21201</p>
            <p className={styles.accommodationsMeta}>(410) 727-7101</p>
            <p className={styles.accommodationsLinkWrap}><a href="https://hotelrevivalbaltimore.com/" className={styles.accommodationsLink}>Book Online +</a></p>
          </div>
        </section>
      </main>
    </>
  )
}
