const { villages, users } = require("../data/mockData");

async function getDashboardAnalytics() {
  const topStates = Object.values(
    villages.reduce((acc, village) => {
      acc[village.state.name] = acc[village.state.name] || { state: village.state.name, villages: 0 };
      acc[village.state.name].villages += 1;
      return acc;
    }, {})
  );

  return {
    metrics: {
      totalVillages: 619245,
      activeUsers: users.filter((user) => user.status === "ACTIVE").length,
      todayRequests: 184225,
      averageResponseTime: 47,
      totalRevenue: 12450
    },
    topStates,
    requests30Days: Array.from({ length: 30 }, (_, i) => ({
      day: `D${i + 1}`,
      requests: 3000 + i * 420 + Math.round(Math.sin(i) * 900)
    })),
    plans: [
      { name: "Free", value: 56 },
      { name: "Premium", value: 28 },
      { name: "Pro", value: 12 },
      { name: "Unlimited", value: 4 }
    ],
    responseTimes: Array.from({ length: 12 }, (_, i) => ({
      hour: `${i * 2}:00`,
      p95: 48 + (i % 4) * 7,
      p99: 82 + (i % 5) * 11
    })),
    endpoints: [
      { endpoint: "/search", success: 58000, clientError: 1300, serverError: 45 },
      { endpoint: "/autocomplete", success: 92000, clientError: 2100, serverError: 31 },
      { endpoint: "/states", success: 12100, clientError: 80, serverError: 2 },
      { endpoint: "/villages", success: 24400, clientError: 450, serverError: 12 }
    ],
    logs: Array.from({ length: 16 }, (_, i) => ({
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
}

module.exports = { getDashboardAnalytics };
