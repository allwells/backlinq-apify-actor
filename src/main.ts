import { Actor } from 'apify';

const BASE_URL = 'https://api.backlinq.dev';

interface Input {
    endpoint: 'domain-authority' | 'backlink-profile' | 'referring-domains' | 'compare-domains';
    domain?: string;
    domains?: string;
    limit?: number;
}

const buildUrl = (input: Input): string => {
    const { endpoint, domain, domains, limit } = input;

    if (endpoint === 'compare-domains') {
        if (!domains?.trim()) throw new Error('The "domains" field is required for compare-domains.');
        return `${BASE_URL}/api/compare-domains?domains=${encodeURIComponent(domains.trim())}`;
    }

    if (!domain?.trim()) throw new Error('The "domain" field is required for this endpoint.');

    const base = `${BASE_URL}/api/${endpoint}?domain=${encodeURIComponent(domain.trim())}`;
    if ((endpoint === 'backlink-profile' || endpoint === 'referring-domains') && limit) {
        return `${base}&limit=${limit}`;
    }
    return base;
};

Actor.main(async () => {
    const input = await Actor.getInput<Input>();

    if (!input?.endpoint) {
        throw new Error('Input is missing. Please provide at least "endpoint" and "domain" or "domains".');
    }

    const proxySecret = process.env.BACKLINQ_PROXY_SECRET;
    if (!proxySecret) {
        throw new Error('BACKLINQ_PROXY_SECRET environment variable is not set.');
    }

    const url = buildUrl(input);

    console.log(`[Backlinq] Calling endpoint: ${input.endpoint}`);
    console.log(`[Backlinq] URL: ${url}`);

    const response = await fetch(url, {
        headers: {
            'X-RapidAPI-Proxy-Secret': proxySecret,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backlinq API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data.success && data.error) {
        throw new Error(`Backlinq returned an error: ${data.error}`);
    }

    await Actor.pushData({
        endpoint: input.endpoint,
        query: input.domain ?? input.domains,
        result: data,
        queriedAt: new Date().toISOString(),
    });

    console.log(`[Backlinq] Success. Data pushed to dataset.`);
});