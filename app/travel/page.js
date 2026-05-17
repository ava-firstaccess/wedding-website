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
              <p>Attire: creative black-tie encourage. Dress in what makes you feel so good that you can&apos;t stop dancing.</p>
              <p><a href="https://web.telegram.org/when-where" className={styles.link}>Full Details +</a></p>
            </div>
          </div>
        </section>

        <section className={styles.detailsSection}>
          <div className={styles.detailsContent}>
            <p className={styles.eyebrow}>When</p>

            <div className={styles.detailBlock}>
              <h2 className={styles.detailHeading}>Thursday,<br />December 31, 2026</h2>
              <p className={styles.detailCopy}>Dinner: 7:00pm—9:00pm</p>
              <p className={styles.detailCopy}>Party: 9:00pm—1:30am</p>
              <p className={styles.detailLinkWrap}><a href="https://web.telegram.org/when-where" className={styles.detailLink}>Full Details +</a></p>
            </div>

            <div className={styles.sectionGap} />

            <p className={styles.eyebrow}>Where</p>

            <div className={styles.detailBlock}>
              <h2 className={styles.detailHeading}>Topside &amp; Garden Room at<br />Hotel Revival</h2>
              <p className={styles.detailCopy}>101 W Monument St,</p>
              <p className={styles.detailCopy}>Baltimore, MD 21201</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
