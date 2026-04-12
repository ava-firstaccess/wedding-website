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
  const res = await fetch(`${SHEETS_BASE}/${encodeURIComponent('Master Guest List!A1:AC500')}`, {
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
  const dinnerQuantity = Number(get('dinner_quantity') || '0')
  const partySize = Number(get('party_size') || '1')
  const inviteType = normalizeInviteType(get('invite_type'))
  const submissionCount = Number(get('rsvp_submission_count') || '0')
  const submitted = get('rsvp_status') === 'submitted'

  return {
    code: get('invite_code'),
    firstName,
    secondGuest,
    inviteType,
    partySize: Number.isFinite(partySize) && partySize > 0 ? partySize : 1,
    dinnerQuantity: Number.isFinite(dinnerQuantity) ? dinnerQuantity : 0,
    partyQuantity: Number.isFinite(partyQuantity) ? partyQuantity : 1,
    submissionCount,
    submitted,
    existingRsvp: submitted ? {
      response: get('rsvp_response'),
      attendanceMode: get('rsvp_attendance_mode'),
      singleAttendeeName: get('rsvp_single_attendee_name'),
      guestCount: get('rsvp_guest_count'),
      partyGuestName: get('rsvp_party_guest_name'),
      dinnerGuestName: get('rsvp_dinner_guest_name'),
      dietary: get('rsvp_dietary'),
      notes: get('rsvp_notes'),
      submittedAt: get('rsvp_submitted_at'),
    } : null,
    rowNumber: null,
  }
}

async function sendSummaryEmail(token, payload) {
  const changed = payload.changed
  const subject = `Wedding RSVP: ${payload.firstName}${payload.secondGuest ? ` & ${payload.secondGuest}` : ''}`
  const body = [
    changed ? `${payload.firstName} changed their RSVP.` : `${payload.firstName} submitted their RSVP.`,
    '',
    `Code: ${payload.code}`,
    `Invite type: ${payload.inviteType}`,
    `Primary guest: ${payload.firstName}`,
    `Second guest: ${payload.secondGuest || '—'}`,
    `Response: ${payload.response}`,
    `Attendance mode: ${payload.attendanceMode || '—'}`,
    `Single attendee: ${payload.singleAttendeeName || '—'}`,
    `Guest count: ${payload.guestCount}`,
    `Party guest: ${payload.partyGuestName || '—'}`,
    `Dinner guest: ${payload.dinnerGuestName || '—'}`,
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

async function appendSubmissionLog(token, payload) {
  const range = 'Submission Logs!A:M'
  const values = [[
    payload.submittedAt,
    payload.code,
    payload.firstName,
    payload.secondGuest || '',
    payload.inviteType,
    payload.response,
    payload.attendanceMode || '',
    payload.singleAttendeeName || '',
    payload.guestCount,
    payload.partyGuestName || '',
    payload.dinnerGuestName || '',
    payload.dietary || '',
    payload.notes || '',
  ]]

  const res = await fetch(`${SHEETS_BASE}/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(`Submission log append failed: ${JSON.stringify(data)}`)
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
    const changed = guest.submitted
    const submissionCount = (guest.submissionCount || 0) + 1

    const response = payload.response || ''
    const attendanceMode = payload.attendanceMode || ''
    const singleAttendeeName = attendanceMode === 'one' ? (payload.singleAttendeeName || '') : ''
    const guestCount = payload.guestCount || ''
    const partyGuestName = payload.partyGuestName || ''
    const dinnerGuestName = payload.dinnerGuestName || ''
    const dietary = payload.dietary || ''
    const notes = payload.notes || ''

    const finalPartyGuestName = response === 'decline' ? '' : partyGuestName
    const finalDinnerGuestName = response === 'decline' ? '' : dinnerGuestName
    const finalDietary = response === 'decline' ? '' : dietary
    const finalNotes = notes

    const updates = [
      'submitted',
      response,
      attendanceMode,
      singleAttendeeName,
      guestCount,
      finalPartyGuestName,
      finalDinnerGuestName,
      finalDietary,
      finalNotes,
      finalNotes,
      submittedAt,
      'pending',
      '',
      String(submissionCount),
    ]

    const range = `Master Guest List!P${rowNumber}:AC${rowNumber}`
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

    await appendSubmissionLog(token, {
      submittedAt,
      code,
      firstName: guest.firstName,
      secondGuest: guest.secondGuest,
      inviteType: guest.inviteType,
      response,
      attendanceMode,
      singleAttendeeName,
      guestCount,
      partyGuestName: finalPartyGuestName,
      dinnerGuestName: finalDinnerGuestName,
      dietary: finalDietary,
      notes: finalNotes,
    })

    await sendSummaryEmail(token, {
      changed,
      code,
      inviteType: guest.inviteType,
      firstName: guest.firstName,
      secondGuest: guest.secondGuest,
      response,
      attendanceMode,
      singleAttendeeName,
      guestCount,
      partyGuestName: finalPartyGuestName,
      dinnerGuestName: finalDinnerGuestName,
      dietary: finalDietary,
      notes: finalNotes,
      submittedAt,
    })

    const emailStatusRange = `Master Guest List!AA${rowNumber}:AB${rowNumber}`
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
