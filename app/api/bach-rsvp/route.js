import { NextResponse } from 'next/server'

const SHEET_ID = '1ipw1XVw5s5avPbemguP1V7OgIrKdJTYf3OdwQEZXSGM'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SHEETS_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Responses!A:E:append?valueInputOption=USER_ENTERED`

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
    const { name, rsvp, knowBy, weekends } = await request.json()

    if (!name || !rsvp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const token = await getAccessToken()
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })

    await fetch(SHEETS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[timestamp, name, rsvp, knowBy || '', weekends || '']],
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('RSVP error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
