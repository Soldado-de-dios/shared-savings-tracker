'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ContributionForm() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('SEK');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;

        setLoading(true);
        try {
            const res = await fetch('/api/contributions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency, userId: 'User' }),
            });
            if (res.ok) {
                setAmount('');
                router.refresh(); // Refresh server components
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3>Add Contribution</h3>
            <form onSubmit={handleSubmit} className="mt-4">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '1rem' }}>
                    <div>
                        <input
                            type="number"
                            className="input"
                            placeholder="Amount (e.g. 100)"
                            value={amount}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Only allow positive integers
                                if (val === '' || /^\d+$/.test(val)) {
                                    setAmount(val);
                                }
                            }}
                            required
                            min="1"
                            step="1"
                        />
                    </div>
                    <div>
                        <select
                            className="select"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <option value="SEK">SEK</option>
                            <option value="GBP">GBP</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Savings'}
                    </button>
                </div>
            </form>
        </div>
    );
}
