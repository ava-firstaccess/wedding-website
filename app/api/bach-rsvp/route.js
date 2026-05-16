import { NextResponse } from 'next/server'

const SHEET_ID = '1ipw1XVw5s5avPbemguP1V7OgIrKdJTYf3OdwQEZXSGM'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SHEETS_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Responses!A:G:append?valueInputOption=USER_ENTERED`

async function getAccessToken() {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  })
  const data = await res.json()
  return data.access_token
}

export async function POST(request) {
  try {
    const { type, name, rsvp, knowBy, weekends, flightInfo } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (type !== 'flight' && !rsvp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (type === 'flight' && !flightInfo) {
      return NextResponse.json({ error: 'Missing flight info' }, { status: 400 })
    }

    const token = await getAccessToken()
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })

    const values = type === 'flight'
      ? [[timestamp, name, 'flight-info', '', '', flightInfo || '', '']]
      : [[timestamp, name, rsvp, knowBy || '', weekends || '', '', '']]

    await fetch(SHEETS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('RSVP error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
