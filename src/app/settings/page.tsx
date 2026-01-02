import { prisma } from '@/lib/prisma';
import { SettingsForm } from '@/components/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    let goal = await prisma.goal.findFirst();
    if (!goal) {
        // Fallback or create default
        return <div>Loading...</div>; // Should ideally create if missing like Home
    }

    return (
        <main className="container" style={{ marginTop: '2rem' }}>
            <h1 className="mb-4">Settings</h1>
            <SettingsForm
                initialTarget={goal.targetAmount}
                initialCurrency={goal.currency}
                goalId={goal.id}
            />

            <div className="text-center mt-4" style={{ color: '#64748b', fontSize: '0.8rem' }}>
                <p>App Version 1.0.0</p>
                <p>Shared Savings Tracker</p>
            </div>
        </main>
    );
}
