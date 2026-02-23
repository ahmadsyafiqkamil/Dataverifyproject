import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { MinerLayout } from "./layouts/MinerLayout";
import { ValidatorLayout } from "./layouts/ValidatorLayout";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { DatasetDetailPage } from "./pages/DatasetDetailPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { MinerDashboard } from "./pages/MinerDashboard";
import { MinerSubmit } from "./pages/MinerSubmit";
import { MinerPlaceholder } from "./pages/MinerPlaceholder";
import { ValidatorDashboard } from "./pages/ValidatorDashboard";
import { ValidatorPlaceholder } from "./pages/ValidatorPlaceholder";

export const router = createBrowserRouter([
  // Standalone landing page — no layout wrapper
  { path: "/landing", Component: LandingPage },

  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "marketplace", Component: MarketplacePage },
      { path: "marketplace/:id", Component: DatasetDetailPage },
      { path: "requests", Component: () => <PlaceholderPage title="My Requests" /> },
      { path: "history", Component: () => <PlaceholderPage title="History" /> },
      { path: "settings", Component: () => <PlaceholderPage title="Settings" /> },
    ],
  },
  {
    path: "/miner",
    Component: MinerLayout,
    children: [
      { index: true, Component: MinerDashboard },
      { path: "submit", Component: MinerSubmit },
      { path: "submissions", Component: MinerPlaceholder },
      { path: "earnings", Component: MinerPlaceholder },
      { path: "settings", Component: MinerPlaceholder },
    ],
  },
  {
    path: "/validator",
    Component: ValidatorLayout,
    children: [
      { index: true, Component: ValidatorDashboard },
      { path: "pending",   Component: () => <ValidatorPlaceholder title="Pending Evaluations" /> },
      { path: "reviews",   Component: () => <ValidatorPlaceholder title="My Reviews" /> },
      { path: "consensus", Component: () => <ValidatorPlaceholder title="Consensus History" /> },
      { path: "earnings",  Component: () => <ValidatorPlaceholder title="Earnings" /> },
    ],
  },
]);