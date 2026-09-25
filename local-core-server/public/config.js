export const AETHEL_CONFIG = {
  appName: "Aethel",
  version: "1.0.0",
  defaultTopic: "corporate",
  topics: {
    corporate: {
      title: "Corporate",
      subtitle: "Executive Control & Oversight",
      accentColor: "#d4af37",
      endpoint: "/api/v1/corporate"
    },
    commercial: {
      title: "Commercial",
      subtitle: "Marketplace & Transactions",
      accentColor: "#3b82f6",
      endpoint: "/api/v1/commercial"
    },
    community: {
      title: "Community",
      subtitle: "Social Listings & Networks",
      accentColor: "#10b981",
      endpoint: "/api/v1/community"
    },
    management: {
      title: "Management",
      subtitle: "System Operations & Agents",
      accentColor: "#8b5cf6",
      endpoint: "/api/v1/management"
    },
    expansion: {
      title: "Expansion",
      subtitle: "Modules & Future Features",
      accentColor: "#f59e0b",
      endpoint: "/api/v1/expansion"
    },
    system: {
      title: "System",
      subtitle: "Core Diagnostics & Logs",
      accentColor: "#ef4444",
      endpoint: "/api/v1/system"
    }
  }
};
