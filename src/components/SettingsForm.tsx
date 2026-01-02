'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
    initialTarget: number; // USD Cents
    initialCurrency: string;
    goalId: string;
};

export function SettingsForm({ initialTarget, initialCurrency, goalId }: Props) {
    const router = useRouter();
    // Display target in Dollars for editing
    const [target, setTarget] = useState((initialTarget / 100).toString());
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Convert dollars back to cents
            const targetCents = Math.round(parseFloat(target) * 100);

            const res = await fetch('/api/goal', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: goalId,
                    targetAmount: targetCents,
                    currency: initialCurrency
                }),
            });
            if (res.ok) {
                router.refresh();
                alert('Goal updated!');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3>Edit Goal</h3>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="input-group">
                    <label className="label">Target Amount (USD)</label>
                    <input
                        type="number"
                        className="input"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        required
                        min="1"
                        step="0.01"
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
