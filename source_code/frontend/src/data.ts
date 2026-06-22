export const fallbackAnalytics = {
  metrics: {
    totalVillages: 619245,
    activeUsers: 142,
    todayRequests: 184225,
    averageResponseTime: 47,
    totalRevenue: 12450
  },
  topStates: [
    { state: "Uttar Pradesh", villages: 107000 },
    { state: "Madhya Pradesh", villages: 55000 },
    { state: "Maharashtra", villages: 44000 },
    { state: "Bihar", villages: 39000 },
    { state: "Rajasthan", villages: 37000 },
    { state: "Tamil Nadu", villages: 16000 }
  ],
  requests30Days: Array.from({ length: 30 }, (_, i) => ({ day: `D${i + 1}`, requests: 3200 + i * 390 })),
  plans: [
    { name: "Free", value: 56 },
    { name: "Premium", value: 28 },
    { name: "Pro", value: 12 },
    { name: "Unlimited", value: 4 }
  ],
  responseTimes: Array.from({ length: 12 }, (_, i) => ({ hour: `${i * 2}:00`, p95: 42 + i * 3, p99: 76 + i * 5 })),
  endpoints: [
    { endpoint: "/search", success: 58000, clientError: 1300, serverError: 45 },
    { endpoint: "/autocomplete", success: 92000, clientError: 2100, serverError: 31 },
    { endpoint: "/states", success: 12100, clientError: 80, serverError: 2 },
    { endpoint: "/villages", success: 24400, clientError: 450, serverError: 12 }
  ],
  logs: Array.from({ length: 12 }, (_, i) => ({
    id: `log_${i}`,
    timestamp: new Date(Date.now() - i * 600000).toISOString(),
    apiKey: "ak_****abcd",
    businessName: i % 2 ? "BharatCart" : "Demo Logistics Pvt Ltd",
    endpoint: i % 2 ? "/v1/autocomplete" : "/v1/search",
    responseTime: 35 + i * 4,
    statusCode: i % 7 === 0 ? 429 : 200,
    ipAddress: "203.0.113.xxx"
  }))
};

export const users = [
  { id: "u1", email: "demo@business.com", businessName: "Demo Logistics Pvt Ltd", status: "Active", planType: "Free", requests: 150 },
  { id: "u2", email: "ops@bharatcart.example", businessName: "BharatCart", status: "Active", planType: "Premium", requests: 18200 },
  { id: "u3", email: "integrations@quickship.example", businessName: "QuickShip", status: "Pending", planType: "Pro", requests: 0 }
];

export const villages = [
  { state: "Maharashtra", district: "Nandurbar", subDistrict: "Akkalkuwa", code: "525002", name: "Manibeli" },
  { state: "Maharashtra", district: "Nandurbar", subDistrict: "Akkalkuwa", code: "525003", name: "Dhankhedi" },
  { state: "Maharashtra", district: "Nandurbar", subDistrict: "Akkalkuwa", code: "525004", name: "Chimalkhadi" },
  { state: "Maharashtra", district: "Nandurbar", subDistrict: "Akkalkuwa", code: "525005", name: "Sinduri" },
  { state: "Karnataka", district: "Bengaluru Rural", subDistrict: "Devanahalli", code: "612301", name: "Bettakote" }
];
