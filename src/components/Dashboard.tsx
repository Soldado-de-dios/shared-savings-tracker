'use client';

type Props = {
    goal: {
        targetAmount: number; // USD Cents
        currentAmount: number; // USD Cents
        currency: string;
    };
};

export function Dashboard({ goal }: Props) {
    // Convert cents to dollars
    const target = goal.targetAmount / 100;
    const current = goal.currentAmount / 100;
    const percent = Math.min(100, Math.max(0, (current / target) * 100));

    const format = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="card">
            <h2 className="label" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Goal Progress
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{format(current)}</span>
                <span style={{ color: '#94a3b8' }}>of {format(target)}</span>
            </div>

            {/* Progress Bar Container */}
            <div style={{
                height: '12px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '999px',
                overflow: 'hidden',
                marginTop: '1rem'
            }}>
                {/* Progress Fill */}
                <div style={{
                    height: '100%',
                    width: `${percent}%`,
                    background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                    borderRadius: '999px',
                    transition: 'width 1s ease-out'
                }} />
            </div>
            <div style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--accent)' }}>
                {percent.toFixed(1)}% Completed
            </div>
        </div>
    );
}
