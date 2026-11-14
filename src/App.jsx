import React from 'react';

export default function App() {
  console.log("🐄 KamadhenuERP: App.jsx component loaded successfully!");

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <h1>🐄 KamadhenuERP</h1>
          <span style={{ background: '#22c55e', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>Live & Connected</span>
        </header>

        <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Smart Dairy Farm & Financial Operating System</h2>
          <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
            Aapka KamadhenuERP Vercel par safalataपूर्वक live ho chuka hai! Ab yahan aapka poora dairy management dashboard chalega.
          </p>
        </div>
      </div>
    </div>
  );
}
