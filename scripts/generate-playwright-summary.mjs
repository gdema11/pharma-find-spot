import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const reportPath = path.resolve('test-results/results.json');
const publicDir = path.resolve('public');
const outputPath = path.resolve('public/test-results-summary.json');

const domainLabels = {
  accessibility: 'Acessibilidade',
  analytics: 'Analytics',
  api: 'API',
  search: 'Busca',
  routing: 'Rotas',
  usability: 'Usabilidade',
};

const createEmptySuites = () =>
  Object.entries(domainLabels).map(([key, name]) => ({
    key,
    name,
    total: 0,
  }));

const normalizeFilePath = (value = '') => String(value).replace(/\\/g, '/').toLowerCase();

const getDomainKeyFromFile = (filePath = '') => {
  const normalized = normalizeFilePath(filePath);

  if (
    normalized === 'accessibility.spec.ts' ||
    normalized.endsWith('/accessibility.spec.ts') ||
    normalized.includes('e2e/accessibility.spec.ts')
  ) {
    return 'accessibility';
  }

  if (
    normalized === 'usability.spec.ts' ||
    normalized.endsWith('/usability.spec.ts') ||
    normalized.includes('e2e/usability.spec.ts')
  ) {
    return 'usability';
  }

  if (
    normalized.startsWith('api/') ||
    normalized.endsWith('/api/catalog-api.spec.ts') ||
    normalized.includes('e2e/api/')
  ) {
    return 'api';
  }

  if (
    normalized.startsWith('search/') ||
    normalized.endsWith('/search/search-behavior.spec.ts') ||
    normalized.includes('e2e/search/')
  ) {
    return 'search';
  }

  if (
    normalized.startsWith('analytics/') ||
    normalized.endsWith('/analytics/search-memory.spec.ts') ||
    normalized.includes('e2e/analytics/')
  ) {
    return 'analytics';
  }

  if (
    normalized.startsWith('routing/') ||
    normalized.endsWith('/routing/navigation.spec.ts') ||
    normalized.includes('e2e/routing/')
  ) {
    return 'routing';
  }

  return null;
};

const formatDuration = (durationMs = 0) => {
  if (durationMs < 1000) {
    return `${durationMs}ms`;
  }

  return `${(durationMs / 1000).toFixed(1)}s`;
};

const formatExecutionDate = (dateValue) => {
  const date = dateValue ? new Date(dateValue) : new Date();

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

const collectSpecs = (node, inheritedFile = '', bucket = []) => {
  if (!node || typeof node !== 'object') {
    return bucket;
  }

  const currentFile = node.file || inheritedFile || '';

  if (Array.isArray(node.specs)) {
    for (const spec of node.specs) {
      const specFile = spec.file || currentFile || '';
      const tests = Array.isArray(spec.tests) ? spec.tests.length : 0;

      if (tests > 0) {
        bucket.push({
          file: specFile,
          total: tests,
        });
      }
    }
  }

  if (Array.isArray(node.suites)) {
    for (const suite of node.suites) {
      collectSpecs(suite, currentFile, bucket);
    }
  }

  return bucket;
};

const reportRaw = await readFile(reportPath, 'utf-8');
const report = JSON.parse(reportRaw);

const specEntries = [];

if (Array.isArray(report.suites)) {
  for (const suite of report.suites) {
    collectSpecs(suite, '', specEntries);
  }
}

const suiteCounts = new Map(createEmptySuites().map((suite) => [suite.key, { ...suite }]));

for (const entry of specEntries) {
  const domainKey = getDomainKeyFromFile(entry.file);

  if (!domainKey) {
    continue;
  }

  const current = suiteCounts.get(domainKey);

  if (!current) {
    continue;
  }

  current.total += entry.total;
}

const stats = report.stats || {};
const total =
  typeof stats.expected === 'number' &&
  typeof stats.unexpected === 'number' &&
  typeof stats.flaky === 'number' &&
  typeof stats.skipped === 'number'
    ? stats.expected + stats.unexpected + stats.flaky + stats.skipped
    : specEntries.reduce((acc, entry) => acc + entry.total, 0);

const passed = typeof stats.expected === 'number' ? stats.expected : 0;
const failed = typeof stats.unexpected === 'number' ? stats.unexpected : 0;
const flaky = typeof stats.flaky === 'number' ? stats.flaky : 0;
const skipped = typeof stats.skipped === 'number' ? stats.skipped : 0;
const durationMs = typeof stats.duration === 'number' ? stats.duration : 0;

const summary = {
  total,
  passed,
  failed,
  flaky,
  skipped,
  duration: formatDuration(durationMs),
  durationMs,
  execution: formatExecutionDate(stats.startTime || new Date().toISOString()),
  browser: 'Chromium',
  approvalRate: total > 0 ? Math.round((passed / total) * 100) : 0,
  suites: Array.from(suiteCounts.values()),
};

await mkdir(publicDir, { recursive: true });
await writeFile(outputPath, JSON.stringify(summary, null, 2), 'utf-8');

console.log(`Resumo gerado em ${outputPath}`);
console.log(JSON.stringify(summary, null, 2));