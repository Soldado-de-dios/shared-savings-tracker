import { prisma } from '@/lib/prisma';
import { Dashboard } from '@/components/Dashboard';
import { ContributionForm } from '@/components/ContributionForm';

// Revalidate every 0 seconds (dynamic) or use standard dynamic behavior
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch goal on server
  let goal = await prisma.goal.findFirst();
  if (!goal) {
    goal = await prisma.goal.create({
      data: { targetAmount: 500000, currency: 'USD' }
    });
  }

  return (
    <main className="container" style={{ marginTop: '2rem' }}>
      <Dashboard goal={goal} />
      <ContributionForm />

      <div style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
        <p>Values are automatically converted to USD.</p>
      </div>
    </main>
  );
}
