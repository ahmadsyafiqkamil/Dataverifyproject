import { createBrowserRouter } from "react-router";
import { AuthGuard } from "./components/auth/AuthGuard";
import { RootLayout } from "./layouts/RootLayout";
import { MinerLayout } from "./layouts/MinerLayout";
import { ValidatorLayout } from "./layouts/ValidatorLayout";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { DatasetDetailPage } from "./pages/DatasetDetailPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { MyRequestsPage } from "./pages/MyRequestsPage";
import { PurchaseHistoryPage } from "./pages/PurchaseHistoryPage";
import { MinerDashboard } from "./pages/MinerDashboard";
import { MinerSubmit } from "./pages/MinerSubmit";
import { MinerPlaceholder } from "./pages/MinerPlaceholder";
import { MinerOpenRequests } from "./pages/MinerOpenRequests";
import { MinerEarnings } from "./pages/MinerEarnings";
import { MinerSubmissions } from "./pages/MinerSubmissions";
import { ValidatorDashboard } from "./pages/ValidatorDashboard";
import { ValidatorPlaceholder } from "./pages/ValidatorPlaceholder";
import { ValidatorPendingEvals } from "./pages/ValidatorPendingEvals";
import { ValidatorMyReviews } from "./pages/ValidatorMyReviews";
import { ValidatorConsensus } from "./pages/ValidatorConsensus";
import { ValidatorEarnings } from "./pages/ValidatorEarnings";

export const router = createBrowserRouter([
  // Public routes — no auth required
  { path: "/landing", Component: LandingPage },
  { path: "/login", Component: LoginPage },

  // Protected: Buyer portal
  {
    path: "/",
    element: <AuthGuard><RootLayout /></AuthGuard>,
    children: [
      { index: true, Component: DashboardPage },
      { path: "marketplace", Component: MarketplacePage },
      { path: "marketplace/:id", Component: DatasetDetailPage },
      { path: "requests", Component: MyRequestsPage },
      { path: "history", Component: PurchaseHistoryPage },
      { path: "settings", Component: () => <PlaceholderPage title="Settings" /> },
    ],
  },

  // Protected: Miner portal
  {
    path: "/miner",
    element: <AuthGuard><MinerLayout /></AuthGuard>,
    children: [
      { index: true, Component: MinerDashboard },
      { path: "requests", Component: MinerOpenRequests },
      { path: "submit", Component: MinerSubmit },
      { path: "submissions", Component: MinerSubmissions },
      { path: "earnings", Component: MinerEarnings },
      { path: "settings", Component: MinerPlaceholder },
    ],
  },

  // Protected: Validator portal
  {
    path: "/validator",
    element: <AuthGuard><ValidatorLayout /></AuthGuard>,
    children: [
      { index: true, Component: ValidatorDashboard },
      { path: "pending",   Component: ValidatorPendingEvals },
      { path: "reviews",   Component: ValidatorMyReviews },
      { path: "consensus", Component: ValidatorConsensus },
      { path: "earnings",  Component: ValidatorEarnings },
    ],
  },
]);