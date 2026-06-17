#!/usr/bin/env node
/**
 * MCP Server for Tarif Pajak ID
 *
 * Exposes Indonesian tax rate database as MCP tools for Claude Desktop,
 * Cursor, Continue, and other MCP-compatible clients.
 *
 * Install:
 *   cd mcp-server && npm install
 *
 * Configure (claude_desktop_config.json):
 *   {
 *     "mcpServers": {
 *       "tarif-pajak": {
 *         "command": "node",
 *         "args": ["/absolute/path/to/tarifpajakmcp/mcp-server/index.js"]
 *       }
 *     }
 *   }
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as z from 'zod';

const BASE = 'https://tarif-pajak-id.pages.dev/api/v1';

async function fetchJSON(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
  return res.json();
}

const server = new McpServer({
  name: 'tarif-pajak',
  version: '1.0.0',
});

// ── Tool: lookup_tax_rate ────────────────────────────────────
// The main tool — search by keyword or get a specific entry
server.registerTool(
  'lookup_tax_rate',
  {
    title: 'Lookup Tax Rate',
    description:
      'Cari tarif pajak Indonesia berdasarkan keyword atau entry ID. Mengembalikan tarif, status (berlaku/dicabut), dasar hukum, dan contoh perhitungan. Contoh query: "PPh 23 jasa", "PPN 2025", "ppn-12pct-mewah-2025", "TER PPh 21".',
    inputSchema: z.object({
      query: z
        .string()
        .describe('Keyword pencarian atau entry ID (e.g. "pph 23", "ppn-12pct-mewah-2025")'),
    }),
  },
  async ({ query }) => {
    const q = query.toLowerCase().trim();
    // If it looks like an entry ID (has dash + matches pattern), fetch directly
    if (/^[a-z]+-[a-z0-9-]+$/.test(q) && q.length > 8) {
      try {
        const entry = await fetchJSON(`/entries/${q}.json`);
        return {
          content: [{ type: 'text', text: formatEntry(entry) }],
        };
      } catch {
        // fall through to search
      }
    }
    // Otherwise search via search-index
    const index = await fetchJSON('/search-index.json');
    const matches = [];
    for (const [id, terms] of Object.entries(index)) {
      const haystack = (id + ' ' + terms.map((t) => t.term).join(' ')).toLowerCase();
      if (haystack.includes(q)) {
        matches.push(id);
        if (matches.length >= 10) break;
      }
    }
    if (matches.length === 0) {
      return {
        content: [
          { type: 'text', text: `Tidak ditemukan entry untuk "${query}". Coba keyword lain atau lihat /api/v1/entries/index.json untuk daftar lengkap.` },
        ],
      };
    }
    // Fetch top 3 details
    const details = await Promise.all(matches.slice(0, 3).map((id) => fetchJSON(`/entries/${id}.json`).catch(() => null)));
    const text = details.filter(Boolean).map(formatEntry).join('\n\n---\n\n');
    return {
      content: [
        {
          type: 'text',
          text: `Ditemukan ${matches.length} entry. Top ${Math.min(3, matches.length)}:\n\n${text}${matches.length > 3 ? `\n\n(+ ${matches.length - 3} lainnya: ${matches.slice(3).join(', ')})` : ''}`,
        },
      ],
    };
  }
);

// ── Tool: get_active_rates_by_year ───────────────────────────
server.registerTool(
  'get_rates_by_year',
  {
    title: 'Get Rates by Year',
    description:
      'Dapatkan semua tarif pajak yang berlaku di tahun tertentu. Berguna untuk perhitungan retrospective atau proyeksi.',
    inputSchema: z.object({
      year: z.number().int().min(1983).max(2030).describe('Tahun (1983-2030)'),
    }),
  },
  async ({ year }) => {
    const data = await fetchJSON(`/by-year/${year}.json`);
    const entries = data.entries || [];
    const aktif = entries.filter((e) => e.status === 'berlaku');
    const text = aktif
      .map(
        (e) =>
          `• ${e.taxType} — ${e.transactionType}: ${formatRate(e.rate)} (${e.id})\n  Sumber: ${(e.legalBasis || []).map((l) => l.regulation).join(', ')}`
      )
      .join('\n');
    return {
      content: [
        {
          type: 'text',
          text: `${aktif.length} tarif berlaku di tahun ${year}:\n\n${text || '(tidak ada)'}`,
        },
      ],
    };
  }
);

// ── Tool: list_categories ────────────────────────────────────
server.registerTool(
  'list_categories',
  {
    title: 'List Tax Categories',
    description: 'Daftar semua kategori pajak di database (PPh 21, PPN, PPnBM, PBB, dll) dengan jumlah entries.',
    inputSchema: z.object({}),
  },
  async () => {
    const data = await fetchJSON('/categories/index.json');
    const cats = data.categories || [];
    const text = cats
      .map((c) => `• ${c.taxType} (${c.slug}) — ${c.entries?.length || 0} entries`)
      .join('\n');
    return {
      content: [{ type: 'text', text: `${cats.length} kategori:\n\n${text}` }],
    };
  }
);

// ── Tool: database_stats ─────────────────────────────────────
server.registerTool(
  'database_stats',
  {
    title: 'Database Statistics',
    description: 'Statistik database tarif pajak: total entries, berlaku/dicabut, distribusi per kategori.',
    inputSchema: z.object({}),
  },
  async () => {
    const data = await fetchJSON('/stats.json');
    const s = data.data;
    const text = [
      `Total entries: ${s.totalEntries}`,
      `Kategori: ${s.totalCategories}`,
      `Regulasi: ${s.totalRegulations}`,
      `Berlaku: ${s.byStatus.berlaku} | Diubah: ${s.byStatus.diubah} | Dicabut: ${s.byStatus.dicabut}`,
      '',
      'Per kategori:',
      ...(s.byCategory || []).map((c) => `  ${c.taxType}: ${c.count}`),
    ].join('\n');
    return { content: [{ type: 'text', text }] };
  }
);

// ── Helpers ──────────────────────────────────────────────────
function formatRate(rate) {
  if (!rate) return '?';
  if (rate.type === 'percentage') return `${rate.value}%`;
  if (rate.type === 'range') return `${rate.value[0]}-${rate.value[1]}%`;
  if (rate.type === 'progressive' && rate.brackets) {
    const rates = rate.brackets.map((b) => b.rate);
    return `${Math.min(...rates)}-${Math.max(...rates)}% (${rate.brackets.length} lapisan)`;
  }
  return String(rate.value);
}

function formatEntry(e) {
  const lines = [
    `${e.taxType} — ${e.transactionType}`,
    `ID: ${e.id}`,
    `Tarif: ${formatRate(e.rate)}`,
    `Status: ${e.status} (berlaku ${e.effectiveFrom}${e.effectiveTo ? ' → ' + e.effectiveTo : ' → sekarang'})`,
  ];
  if (e.legalBasis && e.legalBasis.length) {
    lines.push(
      `Sumber: ` +
        e.legalBasis.map((l) => `${l.regulation} ${l.article || ''} (${l.sourceUrl || 'n/a'})`).join('; ')
    );
  }
  if (e.taxBase) lines.push(`DPP: ${e.taxBase}`);
  if (e.notes) lines.push(`Catatan: ${e.notes.substring(0, 200)}${e.notes.length > 200 ? '...' : ''}`);
  return lines.join('\n');
}

// ── Start ────────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('tarif-pajak MCP server running on stdio');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
