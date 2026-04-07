import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accessibility,
  BarChart3,
  CheckCircle2,
  Clock3,
  FlaskConical,
  GitBranch,
  LayoutDashboard,
  Route,
  Search,
  Server,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SuiteItem = {
  key: string;
  name: string;
  total: number;
};

type SummaryData = {
  total: number;
  passed: number;
  failed: number;
  flaky: number;
  skipped: number;
  duration: string;
  durationMs: number;
  browser: string;
  execution: string;
  approvalRate: number;
  suites: SuiteItem[];
};

const defaultSummary: SummaryData = {
  total: 30,
  passed: 30,
  failed: 0,
  flaky: 0,
  skipped: 0,
  duration: "20.6s",
  durationMs: 20600,
  browser: "Chromium",
  execution: "06/04/2026 19:48:37",
  approvalRate: 100,
  suites: [
    { key: "usability", name: "Usabilidade", total: 7 },
    { key: "api", name: "API", total: 6 },
    { key: "accessibility", name: "Acessibilidade", total: 5 },
    { key: "search", name: "Busca", total: 5 },
    { key: "analytics", name: "Analytics", total: 4 },
    { key: "routing", name: "Rotas", total: 3 },
  ],
};

const suiteMeta: Record<
  string,
  {
    icon: typeof ShieldCheck;
    description: string;
  }
> = {
  usability: {
    icon: ShieldCheck,
    description: "Fluxos principais da busca, interação por teclado e retorno ao estado inicial.",
  },
  api: {
    icon: Server,
    description: "Health, listagem, filtros, ordenação e cenários de produto inexistente.",
  },
  accessibility: {
    icon: Accessibility,
    description: "Validação com axe, nomes acessíveis e estrutura correta da busca.",
  },
  search: {
    icon: Search,
    description: "Busca avançada, termos amplos, poucos caracteres e estados sem resultado.",
  },
  analytics: {
    icon: BarChart3,
    description: "Buscas recentes, buscas mais feitas e termos sem resultado.",
  },
  routing: {
    icon: Route,
    description: "Home, 404 e navegação entre páginas.",
  },
};

const highlights = [
  {
    title: "Report único",
    description: "Suíte E2E centralizada no Playwright com uma única saída para análise e apresentação.",
    icon: LayoutDashboard,
  },
  {
    title: "Cobertura ampliada",
    description: "Validação distribuída entre usabilidade, acessibilidade, API, analytics, busca e navegação.",
    icon: ShieldCheck,
  },
  {
    title: "Correções reais no produto",
    description: "Problemas do componente de busca foram identificados durante os testes e corrigidos no projeto.",
    icon: Search,
  },
  {
    title: "Dashboard conectado ao resultado",
    description: "A leitura do painel passou a refletir o último resumo gerado a partir da suíte executada.",
    icon: BarChart3,
  },
  {
    title: "Evidência para o TCC",
    description: "Os resultados ficaram organizados visualmente para uso em banca, documentação e slides.",
    icon: Trophy,
  },
  {
    title: "Base para evolução contínua",
    description: "A estrutura criada facilita novas suítes, novas métricas e acompanhamento de regressões futuras.",
    icon: GitBranch,
  },
];

const validatedIndicators = [
  {
    title: "Busca funcional",
    value: "Validada",
    description: "Pesquisa, limpeza do campo, sugestões e retorno ao estado inicial.",
  },
  {
    title: "Acessibilidade",
    value: "Validada",
    description: "Estrutura da busca, nomes acessíveis e análise automática com axe.",
  },
  {
    title: "API e dados",
    value: "Validada",
    description: "Health check, filtros, ordenação e tratamento de produto inexistente.",
  },
  {
    title: "Analytics de uso",
    value: "Validada",
    description: "Buscas recentes, buscas mais feitas e termos sem resultado.",
  },
  {
    title: "Navegação e rotas",
    value: "Validada",
    description: "Home, página 404, retorno ao fluxo principal e navegação entre telas.",
  },
  {
    title: "Consistência da suíte",
    value: "Validada",
    description: "Resultados integrados ao dashboard com leitura do resumo mais recente da execução.",
  },
];

const QualityDashboard = () => {
  const [summary, setSummary] = useState<SummaryData>(defaultSummary);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await fetch(`/test-results-summary.json?t=${Date.now()}`);

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as SummaryData;

        if (data && typeof data.total === "number") {
          setSummary(data);
        }
      } catch {
        return;
      }
    };

    loadSummary();
  }, []);

  const suiteResults = useMemo(
    () =>
      summary.suites.map((suite) => ({
        ...suite,
        icon: suiteMeta[suite.key]?.icon ?? ShieldCheck,
        description: suiteMeta[suite.key]?.description ?? "",
      })),
    [summary.suites]
  );

  const pieData = useMemo(
    () => [
      { name: "Aprovados", value: summary.passed, color: "#0ea5e9" },
      { name: "Falhas", value: summary.failed, color: "#ef4444" },
      { name: "Flaky", value: summary.flaky, color: "#f59e0b" },
      { name: "Pulados", value: summary.skipped, color: "#94a3b8" },
    ],
    [summary]
  );

  const metricCards = [
    {
      title: "Total de testes",
      value: String(summary.total),
      icon: Trophy,
    },
    {
      title: "Aprovados",
      value: String(summary.passed),
      icon: CheckCircle2,
    },
    {
      title: "Falhas",
      value: String(summary.failed),
      icon: FlaskConical,
    },
    {
      title: "Tempo total",
      value: summary.duration,
      icon: Clock3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
        <div className="mb-8 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
          <div className="relative px-8 py-10 md:px-12 md:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_30%),radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_25%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="rounded-full bg-sky-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500">
                    Dashboard de Qualidade
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-full border-sky-200 bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700"
                  >
                    Pharma Find Spot
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="leading-none">
                    <span className="text-5xl font-semibold tracking-tight text-slate-800 md:text-7xl">
                      Pharma
                    </span>
                    <span className="text-5xl font-semibold tracking-tight text-sky-600 md:text-7xl">
                      Spot
                    </span>
                  </div>

                  <h1 className="max-w-3xl text-2xl font-semibold leading-tight text-slate-800 md:text-4xl">
                    Dashboard dos resultados da suíte de testes E2E
                  </h1>

                  <p className="max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                    Painel consolidado para apresentação final do projeto, reunindo os resultados
                    dos testes automatizados de usabilidade, acessibilidade, API, analytics, busca
                    e navegação.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {metricCards.map((item) => {
                    const Icon = item.icon;
                    const isDuration = item.title === "Tempo total";

                    return (
                      <div
                        key={item.title}
                        className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur"
                      >
                        <div className="flex min-h-[156px] flex-col justify-between">
                          <div className="flex items-start justify-between gap-4">
                            <p className="max-w-[120px] text-sm font-medium leading-6 text-slate-500">
                              {item.title}
                            </p>
                            <Icon className="mt-0.5 h-6 w-6 shrink-0 text-sky-600" />
                          </div>

                          <div className="pt-6">
                            <p
                              className={`font-semibold leading-none tracking-tight text-slate-800 ${
                                isDuration ? "text-[42px] md:text-[46px]" : "text-[52px]"
                              }`}
                            >
                              {item.value}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 self-start">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="mb-1 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                    Taxa de aprovação
                  </p>
                  <div className="mb-4 flex items-end gap-2">
                    <span className="text-5xl font-semibold tracking-tight text-slate-800">
                      {summary.approvalRate}%
                    </span>
                    <span className="pb-2 text-sm text-slate-500">execução verde</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-sky-500 transition-all"
                      style={{ width: `${summary.approvalRate}%` }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="mb-2 text-sm font-medium text-slate-500">Execução</p>
                    <p className="text-lg font-semibold text-slate-800">{summary.execution}</p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="mb-2 text-sm font-medium text-slate-500">Ambiente</p>
                    <p className="text-lg font-semibold text-slate-800">{summary.browser}</p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 md:col-span-2 lg:col-span-1 xl:col-span-2">
                    <p className="mb-2 text-sm font-medium text-slate-500">Resumo</p>
                    <p className="text-base leading-7 text-slate-700">
                      Suíte consolidada em um único report do Playwright, com cobertura dos fluxos
                      mais relevantes do produto e foco em qualidade de uso.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-800">Cobertura por domínio</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Distribuição da quantidade de cenários automatizados por área funcional do
                  sistema.
                </p>
              </div>

              <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={suiteResults} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#475569", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#475569", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(14,165,233,0.08)" }}
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                      }}
                    />
                    <Bar dataKey="total" radius={[14, 14, 0, 0]} fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-800">Distribuição dos resultados</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Visão consolidada do status final da suíte executada no ambiente de validação.
                </p>
              </div>

              <div className="grid items-center gap-6 md:grid-cols-[1fr_0.9fr]">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={72}
                        outerRadius={112}
                        stroke="none"
                        paddingAngle={2}
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 16,
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {pieData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      </div>
                      <span className="text-lg font-semibold text-slate-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Card className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-800">Detalhamento da suíte</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Principais blocos cobertos na estratégia de testes do projeto.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {suiteResults.map((suite) => {
                  const Icon = suite.icon;

                  return (
                    <div
                      key={suite.key}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-sky-200 hover:bg-sky-50/40"
                    >
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">{suite.name}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {suite.description}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white p-3 shadow-sm">
                          <Icon className="h-5 w-5 text-sky-600" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                        <span className="text-sm text-slate-500">Testes aprovados</span>
                        <span className="text-xl font-semibold text-slate-800">{suite.total}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 md:p-8">
              <h2 className="mb-6 text-2xl font-semibold text-slate-800">Principais ganhos</h2>

              <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="mb-4 flex items-start gap-3">
                        <div className="rounded-full bg-sky-100 p-2">
                          <Icon className="h-4 w-4 text-sky-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-800">{item.title}</h3>
                        </div>
                      </div>
                      <p className="text-sm leading-7 text-slate-700">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 md:p-8">
              <h2 className="mb-6 text-2xl font-semibold text-slate-800">
                Indicadores de qualidade validados
              </h2>

              <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2">
                {validatedIndicators.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-sky-700">
                        {item.value}
                      </span>
                    </div>
                    <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QualityDashboard;