import { NextResponse } from 'next/server'

const SHEET_ID = '1Hh27Pp9Dr8qmMMG-zZGXsuSv7Zz1P7qmfsv_1gwE6bE'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SHEETS_BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`
const GMAIL_SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send'

function json(status, body) {
  return NextResponse.json(body, { status })
}

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
  if (!res.ok || !data.access_token) {
    throw new Error(`Google token error: ${JSON.stringify(data)}`)
  }
  return data.access_token
}

async function getSheetRows(token) {
  const res = await fetch(`${SHEETS_BASE}/${encodeURIComponent('Sheet1!A1:X500')}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Sheets read failed: ${JSON.stringify(data)}`)
  return data.values || []
}

function normalizeInviteType(value = '') {
  const normalized = value.trim().toLowerCase()
  if (normalized.includes('dinner')) return 'full'
  if (normalized.includes('party')) return 'party'
  return 'party'
}

function buildGuest(headers, row) {
  const get = (name) => {
    const index = headers.indexOf(name)
    return index >= 0 ? row[index] || '' : ''
  }

  const firstName = get('guest_1_first_name')
  const secondGuest = get('guest_2_first_name')
  const partyQuantity = Number(get('party_quantity') || '1')
  const inviteType = normalizeInviteType(get('invite_type'))

  return {
    code: get('invite_code'),
    firstName,
    secondGuest,
    inviteType,
    partySize: Number.isFinite(partyQuantity) && partyQuantity > 0 ? partyQuantity : 1,
    rowNumber: null,
  }
}

async function sendSummaryEmail(token, payload) {
  const subject = `Wedding RSVP: ${payload.firstName}${payload.secondGuest ? ` & ${payload.secondGuest}` : ''}`
  const body = [
    `Code: ${payload.code}`,
    `Invite type: ${payload.inviteType}`,
    `Primary guest: ${payload.firstName}`,
    `Second guest: ${payload.secondGuest || '—'}`,
    `Response: ${payload.response}`,
    `Guest count: ${payload.guestCount}`,
    `Guest name: ${payload.guestName || '—'}`,
    `Dietary: ${payload.dietary || '—'}`,
    `Notes / Song request: ${payload.notes || '—'}`,
    `Submitted at: ${payload.submittedAt}`,
  ].join('\n')

  const mime = [
    'To: cierazachbosson@gmail.com',
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    body,
  ].join('\n')

  const raw = Buffer.from(mime)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')

  const res = await fetch(GMAIL_SEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(`Gmail send failed: ${JSON.stringify(data)}`)
  return data
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = (searchParams.get('code') || '').trim().toUpperCase()
    if (!code) return json(400, { error: 'Missing code' })

    const token = await getAccessToken()
    const rows = await getSheetRows(token)
    const [headers, ...dataRows] = rows
    const matchIndex = dataRows.findIndex((row) => (row[0] || '').trim().toUpperCase() === code)
    if (matchIndex === -1) return json(404, { error: 'Code not found' })

    const guest = buildGuest(headers, dataRows[matchIndex])
    guest.rowNumber = matchIndex + 2
    return json(200, { guest })
  } catch (error) {
    console.error('RSVP lookup error:', error)
    return json(500, { error: 'Lookup failed' })
  }
}

export async function POST(request) {
  try {
    const token = await getAccessToken()
    const payload = await request.json()
    const code = (payload.code || '').trim().toUpperCase()
    if (!code) return json(400, { error: 'Missing code' })

    const rows = await getSheetRows(token)
    const [headers, ...dataRows] = rows
    const matchIndex = dataRows.findIndex((row) => (row[0] || '').trim().toUpperCase() === code)
    if (matchIndex === -1) return json(404, { error: 'Code not found' })

    const rowNumber = matchIndex + 2
    const guest = buildGuest(headers, dataRows[matchIndex])
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })

    const response = payload.response || ''
    const guestCount = payload.guestCount || ''
    const guestName = payload.guestName || ''
    const dietary = payload.dietary || ''
    const notes = payload.notes || ''

    const updates = [
      'submitted',
      response,
      guestCount,
      guestName,
      dietary,
      notes,
      notes,
      submittedAt,
      'pending',
      '',
    ]

    const range = `Sheet1!O${rowNumber}:X${rowNumber}`
    const updateRes = await fetch(`${SHEETS_BASE}/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [updates] }),
    })
    const updateData = await updateRes.json()
    if (!updateRes.ok) throw new Error(`Sheets update failed: ${JSON.stringify(updateData)}`)

    await sendSummaryEmail(token, {
      code,
      inviteType: guest.inviteType,
      firstName: guest.firstName,
      secondGuest: guest.secondGuest,
      response,
      guestCount,
      guestName,
      dietary,
      notes,
      submittedAt,
    })

    const emailStatusRange = `Sheet1!W${rowNumber}:X${rowNumber}`
    await fetch(`${SHEETS_BASE}/${encodeURIComponent(emailStatusRange)}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [['sent', submittedAt]] }),
    })

    return json(200, { ok: true })
  } catch (error) {
    console.error('RSVP submit error:', error)
    return json(500, { error: 'Submit failed' })
  }
}
