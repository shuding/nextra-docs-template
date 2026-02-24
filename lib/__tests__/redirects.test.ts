/**
 * Tests for Next.js redirect configuration
 * Validates that /agent-builder/* URLs redirect to /vibeshield/*
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextConfig = require('../../next.config.js');

export {}; // Make this a module for TypeScript

describe('Redirect Configuration', () => {
  let redirects: Array<{
    source: string;
    destination: string;
    permanent: boolean;
  }>;

  beforeAll(async () => {
    // The redirects function is async in Next.js
    redirects = await nextConfig.redirects();
  });

  test('redirects function is defined', () => {
    expect(nextConfig.redirects).toBeDefined();
    expect(typeof nextConfig.redirects).toBe('function');
  });

  test('returns redirect rules array', () => {
    expect(Array.isArray(redirects)).toBe(true);
    expect(redirects.length).toBeGreaterThan(0);
  });

  describe('agent-builder to vibeshield redirects', () => {
    test('redirects /agent-builder to /vibeshield', () => {
      const redirect = redirects.find((r) => r.source === '/agent-builder');

      expect(redirect).toBeDefined();
      expect(redirect?.destination).toBe('/vibeshield');
      expect(redirect?.permanent).toBe(true);
    });

    test('redirects /agent-builder/:path* to /vibeshield/:path*', () => {
      const redirect = redirects.find(
        (r) => r.source === '/agent-builder/:path*'
      );

      expect(redirect).toBeDefined();
      expect(redirect?.destination).toBe('/vibeshield/:path*');
      expect(redirect?.permanent).toBe(true);
    });

    test('all redirects are permanent (301)', () => {
      const agentBuilderRedirects = redirects.filter((r) =>
        r.source.startsWith('/agent-builder')
      );

      expect(agentBuilderRedirects.length).toBe(2);
      agentBuilderRedirects.forEach((redirect) => {
        expect(redirect.permanent).toBe(true);
      });
    });
  });

  describe('redirect pattern matching', () => {
    // Helper to simulate Next.js path matching
    function matchesPattern(
      pattern: string,
      path: string
    ): { matched: boolean; params?: Record<string, string> } {
      // Handle exact match
      if (!pattern.includes(':')) {
        return { matched: pattern === path };
      }

      // Handle :path* wildcard pattern
      if (pattern.endsWith(':path*')) {
        const prefix = pattern.replace(':path*', '');
        if (path.startsWith(prefix)) {
          return {
            matched: true,
            params: { path: path.slice(prefix.length) },
          };
        }
        return { matched: false };
      }

      return { matched: false };
    }

    test('pattern matches /agent-builder/connectors/datadog', () => {
      const pattern = '/agent-builder/:path*';
      const result = matchesPattern(pattern, '/agent-builder/connectors/datadog');

      expect(result.matched).toBe(true);
      expect(result.params?.path).toBe('connectors/datadog');
    });

    test('pattern matches /agent-builder/get_started', () => {
      const pattern = '/agent-builder/:path*';
      const result = matchesPattern(pattern, '/agent-builder/get_started');

      expect(result.matched).toBe(true);
      expect(result.params?.path).toBe('get_started');
    });

    test('pattern matches deeply nested paths', () => {
      const pattern = '/agent-builder/:path*';
      const result = matchesPattern(
        pattern,
        '/agent-builder/product/assets/agents'
      );

      expect(result.matched).toBe(true);
      expect(result.params?.path).toBe('product/assets/agents');
    });

    test('exact match for /agent-builder without trailing slash', () => {
      const pattern = '/agent-builder';
      const result = matchesPattern(pattern, '/agent-builder');

      expect(result.matched).toBe(true);
    });
  });
});
