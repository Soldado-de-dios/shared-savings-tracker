import { prisma } from '@/lib/prisma';
import { Contribution } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
    const contributions = await prisma.contribution.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <main className="container" style={{ marginTop: '2rem' }}>
            <h1 className="mb-4">History</h1>
            <div className="card">
                {contributions.length === 0 ? (
                    <p style={{ color: '#94a3b8', textAlign: 'center' }}>No contributions yet.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {contributions.map((c: Contribution) => (
                            <li key={c.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem 0',
                                borderBottom: '1px solid var(--border)'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {c.originalAmount} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{c.originalCurrency}</span>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                        {new Date(c.createdAt).toLocaleDateString()} • {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        +${(c.amount / 100).toFixed(2)}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                        Rate: {c.exchangeRate.toFixed(2)}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
