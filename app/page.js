export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f0eb 0%, #e8ddd3 100%)',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 300, letterSpacing: '0.15em', marginBottom: '1rem' }}>
        ZACH & CIERA
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666', letterSpacing: '0.1em' }}>
        Coming Soon
      </p>
    </main>
  )
}
