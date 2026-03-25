import json
from pathlib import Path

MOCK_DIR = Path(__file__).resolve().parent.parent / "mock"


def _load(name: str) -> list | dict:
    with open(MOCK_DIR / name, encoding="utf-8") as f:
        return json.load(f)


class MockDataService:
    def __init__(self) -> None:
        self.datasets: list[dict] = _load("datasets.json")
        self.activities: list[dict] = _load("activities.json")
        self.eval_queue: list[dict] = _load("eval_queue.json")
        self.submissions: list[dict] = _load("submissions.json")
        self.miner_earnings: dict = _load("miner_earnings.json")
        self.validator_reviews: dict = _load("validator_reviews.json")
        self.validator_consensus: list[dict] = _load("validator_consensus.json")
        self.validator_earnings: dict = _load("validator_earnings.json")
        self.purchases_data: dict = _load("purchases.json")
        self.requests: list[dict] = _load("requests.json")

    # --- Buyer ---

    def get_buyer_stats(self) -> list[dict]:
        return [
            {"label": "Total Datasets", "value": "2,847", "trend": "+12.4%", "trendUp": True, "sub": "across all domains", "color": "#38bdf8", "glow": "rgba(56,189,248,0.2)"},
            {"label": "Avg Quality Score", "value": "91.3", "trend": "+2.1%", "trendUp": True, "sub": "verified by subnet", "color": "#a78bfa", "glow": "rgba(167,139,250,0.2)"},
            {"label": "TAO Spent", "value": "348.72", "trend": "-4.5%", "trendUp": False, "sub": "this month", "color": "#fb923c", "glow": "rgba(251,146,60,0.2)"},
            {"label": "Active Requests", "value": "14", "trend": "+3", "trendUp": True, "sub": "pending fulfillment", "color": "#34d399", "glow": "rgba(52,211,153,0.2)"},
        ]

    def get_datasets(
        self,
        domain: str | None = None,
        search: str | None = None,
        sort_by: str = "qualityScore",
        sort_order: str = "desc",
        page: int = 1,
        limit: int = 6,
    ) -> tuple[list[dict], int]:
        items = list(self.datasets)

        if domain:
            items = [d for d in items if d["domain"].lower() == domain.lower()]

        if search:
            q = search.lower()
            items = [
                d for d in items
                if q in d["name"].lower() or q in d["description"].lower()
                or any(q in t.lower() for t in d["tags"])
            ]

        reverse = sort_order == "desc"
        if sort_by in ("qualityScore", "purchases"):
            items.sort(key=lambda d: d.get(sort_by, 0), reverse=reverse)
        elif sort_by == "price":
            items.sort(key=lambda d: float(d.get("price", "0")), reverse=reverse)
        elif sort_by == "name":
            items.sort(key=lambda d: d["name"].lower(), reverse=reverse)

        total = len(items)
        start = (page - 1) * limit
        items = items[start : start + limit]
        return items, total

    def get_dataset_by_id(self, dataset_id: int) -> dict | None:
        return next((d for d in self.datasets if d["id"] == dataset_id), None)

    def get_activities(self) -> list[dict]:
        return self.activities

    def get_purchase_history(self) -> dict:
        return self.purchases_data

    def get_requests_list(self) -> list[dict]:
        return self.requests

    # --- Miner ---

    def get_miner_stats(self) -> dict:
        return {
            "datasetsSubmitted": "23",
            "qualityAvg": "91.4",
            "totalEarned": "142.8",
            "activeRequests": "7",
        }

    def get_submissions(self) -> list[dict]:
        return self.submissions

    def get_miner_earnings_data(self) -> dict:
        return self.miner_earnings

    def get_miner_requests(self) -> list[dict]:
        return self.requests

    # --- Validator ---

    def get_validator_stats(self) -> list[dict]:
        return [
            {
                "id": "accuracy", "label": "Accuracy Score", "value": "97.3%",
                "sub": "+0.4% from last epoch", "color": "#a855f7",
                "bg": "rgba(168,85,247,0.08)", "border": "rgba(168,85,247,0.18)",
                "sparkline": [91, 93, 92, 94, 95, 94, 96, 97, 97.3], "isTao": False,
            },
            {
                "id": "evals", "label": "Evaluations", "value": "1,284",
                "sub": "47 this epoch", "color": "#38bdf8",
                "bg": "rgba(56,189,248,0.08)", "border": "rgba(56,189,248,0.18)",
                "sparkline": [38, 41, 39, 44, 42, 45, 43, 46, 47], "isTao": False,
            },
            {
                "id": "earned", "label": "TAO Earned", "value": "214.6",
                "sub": "+52.3 this epoch", "color": "#22c55e",
                "bg": "rgba(34,197,94,0.08)", "border": "rgba(34,197,94,0.18)",
                "sparkline": [28, 31, 35, 38, 42, 44, 48, 50, 52.3], "isTao": True,
            },
            {
                "id": "consensus", "label": "Consensus Rate", "value": "94.1%",
                "sub": "aligned with network", "color": "#f59e0b",
                "bg": "rgba(245,158,11,0.08)", "border": "rgba(245,158,11,0.18)",
                "sparkline": [89, 90, 91, 92, 91, 93, 92, 94, 94.1], "isTao": False,
            },
        ]

    def get_validator_pending(self) -> list[dict]:
        return self.eval_queue

    def get_validator_reviews(self) -> dict:
        return self.validator_reviews

    def get_validator_consensus(self) -> list[dict]:
        return self.validator_consensus

    def get_validator_earnings_data(self) -> dict:
        return self.validator_earnings


mock_service = MockDataService()
