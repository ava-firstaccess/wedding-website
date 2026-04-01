'use client'

import Nav from '../components/Nav'
import styles from './page.module.css'

export default function RSVP() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <form className={styles.form}>
          <h1 className={styles.title}>RSVP</h1>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" name="firstName" type="text" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" name="lastName" type="text" required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" />
            </div>
          </div>

          <fieldset className={styles.fieldset}>
            <legend>Attendance</legend>
            <label className={styles.radio}>
              <input type="radio" name="attendance" value="dinner-party" required />
              <span>Dinner + Party</span>
            </label>
            <label className={styles.radio}>
              <input type="radio" name="attendance" value="party-only" />
              <span>Party Only</span>
            </label>
          </fieldset>

          <div className={styles.field}>
            <label htmlFor="dietary">Dietary Restrictions</label>
            <input id="dietary" name="dietary" type="text" />
          </div>

          <div className={styles.field}>
            <label htmlFor="plusOne">Plus One Name</label>
            <input id="plusOne" name="plusOne" type="text" />
          </div>

          <button type="submit" className={styles.button}>Submit</button>
        </form>
      </main>
    </>
  )
}
