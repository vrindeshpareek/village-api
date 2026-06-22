import {
  Activity,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ClipboardList,
  Database,
  KeyRound,
  LayoutDashboard,
  Menu,
  Search,
  ShieldCheck,
  Users
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { ReactElement, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./api/client";
import { fallbackAnalytics, users, villages } from "./data";
import { useUiStore, View } from "./stores/ui";

type Analytics = typeof fallbackAnalytics;

const nav: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "analytics", label: "Analytics", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "village-browser", label: "Villages", icon: Database },
  { id: "logs", label: "API Logs", icon: ClipboardList },
  { id: "portal", label: "B2B Portal", icon: KeyRound },
  { id: "docs", label: "Docs", icon: BookOpen }
];

function Shell() {
  const { view, setView, collapsed, setCollapsed } = useUiStore();
  const title = nav.find((item) => item.id === view)?.label || "Analytics";

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-ink">
      <aside className={`fixed inset-y-0 left-0 z-20 border-r border-slate-200 bg-white ${collapsed ? "w-20" : "w-64"}`}>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded bg-mint text-white">
              <ShieldCheck size={19} />
            </div>
            {!collapsed && <span className="text-base font-semibold">Village API</span>}
          </div>
          <button className="rounded p-2 hover:bg-slate-100" onClick={() => setCollapsed(!collapsed)} title="Toggle sidebar">
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex h-11 w-full items-center gap-3 rounded px-3 text-left text-sm ${active ? "bg-mint text-white" : "text-slate-600 hover:bg-slate-100"}`}
                title={item.label}
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className={`${collapsed ? "pl-20" : "pl-64"} transition-[padding]`}>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6">
          <div>
            <p className="text-xs uppercase text-slate-500">Village API / {title}</p>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded border border-slate-200 px-3 py-2 md:flex">
              <Search size={16} className="text-slate-400" />
              <input className="w-56 outline-none" placeholder="Search users, keys, villages" />
            </div>
            <div className="grid h-9 w-9 place-items-center rounded bg-coral text-white text-sm font-semibold">VR</div>
          </div>
        </header>
        <section className="p-6">{view === "analytics" ? <AnalyticsView /> : view === "users" ? <UsersView /> : view === "village-browser" ? <VillageBrowser /> : view === "logs" ? <LogsView /> : view === "portal" ? <PortalView /> : <DocsView />}</section>
      </main>
    </div>
  );
}

function AnalyticsView() {
  const { data } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => apiGet<Analytics>("/api/admin/analytics"),
    retry: false
  });
  const analytics = data || fallbackAnalytics;
  const metrics: { label: string; value: string; change: string; icon: typeof Database }[] = [
    { label: "Total Villages", value: analytics.metrics.totalVillages.toLocaleString(), change: "+2.8%", icon: Database },
    { label: "Active Users", value: analytics.metrics.activeUsers.toLocaleString(), change: "+12", icon: Users },
    { label: "Today's Requests", value: analytics.metrics.todayRequests.toLocaleString(), change: "+18%", icon: Activity },
    { label: "Avg Response", value: `${analytics.metrics.averageResponseTime}ms`, change: "SLA ok", icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map(({ label, value, change, icon: Icon }) => (
          <div key={label} className="rounded border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-semibold">{value}</p>
              </div>
              <Icon className="text-mint" size={20} />
            </div>
            <p className="mt-3 text-sm text-mint">{change}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartPanel title="Top states by village count">
          <BarChart data={analytics.topStates}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="state" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="villages" fill="#0f766e" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ChartPanel>
        <ChartPanel title="API requests over 30 days">
          <LineChart data={analytics.requests30Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="requests" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartPanel>
        <ChartPanel title="User distribution by plan">
          <PieChart>
            <Pie data={analytics.plans} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
              {["#0f766e", "#2563eb", "#b45309", "#7c3aed"].map((color) => <Cell key={color} fill={color} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartPanel>
        <ChartPanel title="Response time trends">
          <AreaChart data={analytics.responseTimes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="p95" stroke="#0f766e" fill="#99f6e4" />
            <Area type="monotone" dataKey="p99" stroke="#b45309" fill="#fed7aa" />
          </AreaChart>
        </ChartPanel>
      </div>
      <ChartPanel title="Requests by endpoint">
        <BarChart data={analytics.endpoints}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="endpoint" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="success" stackId="a" fill="#0f766e" />
          <Bar dataKey="clientError" stackId="a" fill="#f59e0b" />
          <Bar dataKey="serverError" stackId="a" fill="#dc2626" />
        </BarChart>
      </ChartPanel>
    </div>
  );
}

function ChartPanel({ title, children }: { title: string; children: ReactElement }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4">
      <h2 className="mb-4 text-sm font-semibold">{title}</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function UsersView() {
  return (
    <DataSection title="User management">
      <Table headers={["Business", "Email", "Status", "Plan", "Requests", "Actions"]}>
        {users.map((user) => (
          <tr key={user.id} className="border-t border-slate-100">
            <td className="px-4 py-3 font-medium">{user.businessName}</td>
            <td className="px-4 py-3 text-slate-600">{user.email}</td>
            <td className="px-4 py-3"><Badge tone={user.status === "Active" ? "green" : "amber"}>{user.status}</Badge></td>
            <td className="px-4 py-3">{user.planType}</td>
            <td className="px-4 py-3">{user.requests.toLocaleString()}</td>
            <td className="px-4 py-3"><button className="rounded bg-mint px-3 py-2 text-sm text-white">Review</button></td>
          </tr>
        ))}
      </Table>
    </DataSection>
  );
}

function VillageBrowser() {
  return (
    <DataSection title="Village master list">
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <select className="rounded border border-slate-200 px-3 py-2"><option>Maharashtra</option><option>Karnataka</option></select>
        <select className="rounded border border-slate-200 px-3 py-2"><option>Nandurbar</option><option>Bengaluru Rural</option></select>
        <select className="rounded border border-slate-200 px-3 py-2"><option>Akkalkuwa</option><option>Devanahalli</option></select>
        <input className="rounded border border-slate-200 px-3 py-2" placeholder="Village name" />
      </div>
      <Table headers={["State", "District", "Sub-District", "Village Code", "Village Name"]}>
        {villages.map((village) => (
          <tr key={village.code} className="border-t border-slate-100">
            <td className="px-4 py-3">{village.state}</td>
            <td className="px-4 py-3">{village.district}</td>
            <td className="px-4 py-3">{village.subDistrict}</td>
            <td className="px-4 py-3 font-mono text-sm">{village.code}</td>
            <td className="px-4 py-3 font-medium">{village.name}</td>
          </tr>
        ))}
      </Table>
    </DataSection>
  );
}

function LogsView() {
  return (
    <DataSection title="API logs viewer">
      <Table headers={["Timestamp", "API Key", "Business", "Endpoint", "Response", "Status", "IP"]}>
        {fallbackAnalytics.logs.map((log) => (
          <tr key={log.id} className="border-t border-slate-100">
            <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
            <td className="px-4 py-3 font-mono text-sm">{log.apiKey}</td>
            <td className="px-4 py-3">{log.businessName}</td>
            <td className="px-4 py-3 font-mono text-sm">{log.endpoint}</td>
            <td className="px-4 py-3">{log.responseTime}ms</td>
            <td className="px-4 py-3"><Badge tone={log.statusCode === 200 ? "green" : "amber"}>{log.statusCode}</Badge></td>
            <td className="px-4 py-3">{log.ipAddress}</td>
          </tr>
        ))}
      </Table>
    </DataSection>
  );
}

function PortalView() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <DataSection title="Usage summary">
        <div className="grid gap-3 sm:grid-cols-2">
          {["Today's Requests / 5,000", "Monthly Requests", "Average Response", "Success Rate"].map((item, index) => (
            <div key={item} className="rounded border border-slate-200 p-4">
              <p className="text-sm text-slate-500">{item}</p>
              <p className="mt-2 text-2xl font-semibold">{["150", "12,450", "47ms", "99.2%"][index]}</p>
            </div>
          ))}
        </div>
      </DataSection>
      <DataSection title="API key management">
        <Table headers={["Key Name", "API Key", "Created", "Last Used", "Status"]}>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3">Production Server</td>
            <td className="px-4 py-3 font-mono text-sm">ak_****abcd</td>
            <td className="px-4 py-3">2026-04-22</td>
            <td className="px-4 py-3">Today</td>
            <td className="px-4 py-3"><Badge tone="green">Active</Badge></td>
          </tr>
        </Table>
      </DataSection>
    </div>
  );
}

function DocsView() {
  return (
    <DataSection title="Interactive API documentation">
      <div className="grid gap-4 lg:grid-cols-3">
        {["Copy your API key", "Make your first request", "Monitor usage"].map((title, index) => (
          <div key={title} className="rounded border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Step {index + 1}</p>
            <h3 className="mt-2 font-semibold">{title}</h3>
            <code className="mt-4 block rounded bg-slate-950 p-3 text-sm text-slate-100">
              {index === 1 ? 'curl "/v1/autocomplete?q=man"' : index === 0 ? "ak_demo_public_key_for_presentations" : "Open API Logs"}
            </code>
          </div>
        ))}
      </div>
    </DataSection>
  );
}

function DataSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        <button className="rounded border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">Export</button>
      </div>
      {children}
    </div>
  );
}

function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="table-scroll overflow-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>{headers.map((header) => <th key={header} className="px-4 py-3 font-semibold">{header}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Badge({ tone, children }: { tone: "green" | "amber"; children: ReactNode }) {
  const cls = tone === "green" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700";
  return <span className={`inline-flex rounded px-2 py-1 text-xs font-medium ${cls}`}>{children}</span>;
}

export default Shell;
