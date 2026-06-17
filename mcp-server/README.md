# Tarif Pajak MCP Server

MCP (Model Context Protocol) server yang expose database tarif pajak Indonesia ke Claude Desktop, Cursor, dan MCP-compatible clients.

## Install

```bash
cd mcp-server
npm install
```

## Konfigurasi

### Claude Desktop
Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) atau `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "tarif-pajak": {
      "command": "node",
      "args": ["/absolute/path/to/tarifpajakmcp/mcp-server/index.js"]
    }
  }
}
```

### Cursor
Edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "tarif-pajak": {
      "command": "node",
      "args": ["/absolute/path/to/tarifpajakmcp/mcp-server/index.js"]
    }
  }
}
```

Restart Claude Desktop / Cursor setelah edit.

## Tools yang tersedia

| Tool | Deskripsi |
|------|-----------|
| `lookup_tax_rate` | Cari tarif by keyword atau entry ID |
| `get_rates_by_year` | Semua tarif berlaku di tahun tertentu |
| `list_categories` | Daftar 15 kategori pajak |
| `database_stats` | Statistik database (total, berlaku, dicabut) |

## Contoh pakai di Claude

Setelah MCP server terpasang, tanya Claude:

- "Berapa tarif PPh 23 jasa tahun 2024?"
- "Cari semua tarif PPN yang berlaku sekarang"
- "Tarif TER PPh 21 untuk TK/1"
- "Berapa total entries di database?"

Claude akan otomatis pakai tools ini untuk query API dan menjawab dengan sumber regulasi.

## Data source

API: `https://tarif-pajak-id.pages.dev/api/v1/` (static JSON, no auth)
Website: https://tarif-pajak-id.pages.dev
