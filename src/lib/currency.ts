const RATES_CACHE: { [key: string]: number } = {};
let lastFetch = 0;
const CACHE_TTL = 3600 * 1000; // 1 hour

/**
 * Fetches exchange rates relative to USD.
 * Returns the rate to convert FROM the given currency TO USD.
 * E.g. if 1 USD = 10 SEK, then rate for SEK->USD is 0.1
 */
export async function getRateToUSD(currency: string): Promise<number> {
    if (currency === 'USD') return 1;

    const now = Date.now();
    // Fetch if cache is empty or stale
    if (Object.keys(RATES_CACHE).length === 0 || now - lastFetch > CACHE_TTL) {
        try {
            // API returns how many X you get for 1 USD.
            const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=SEK,GBP');
            const data = await res.json();

            if (data && data.rates) {
                RATES_CACHE['SEK'] = data.rates.SEK; // e.g. 10.5
                RATES_CACHE['GBP'] = data.rates.GBP; // e.g. 0.79
                RATES_CACHE['USD'] = 1;
                lastFetch = now;
            }
        } catch (error) {
            console.error('Failed to fetch exchange rates, using fallback', error);
            // Fallback defaults
            if (!RATES_CACHE['SEK']) RATES_CACHE['SEK'] = 10.5;
            if (!RATES_CACHE['GBP']) RATES_CACHE['GBP'] = 0.79;
            RATES_CACHE['USD'] = 1;
        }
    }

    // Rate calc: 1 USD = X_rate * 1 Unit.
    // 1 Unit = (1/X_rate) USD.
    const rateFromUSD = RATES_CACHE[currency] || 1;
    return 1 / rateFromUSD;
}

/**
 * Converts an integer amount (major units, e.g. 100 SEK) to USD Cents.
 */
export async function convertToUSDCents(amountMajor: number, currency: string): Promise<{ usdCents: number; rate: number }> {
    const rate = await getRateToUSD(currency);
    // Amount (major) * Rate (to USD) = USD (major)
    // USD (major) * 100 = USD Cents.
    const usdCents = Math.round(amountMajor * rate * 100);
    return { usdCents, rate };
}

/**
 * Get display rate e.g. 1 USD = 10.5 SEK
 */
export function getDisplayRate(currency: string): number {
    return RATES_CACHE[currency] || 1;
}
