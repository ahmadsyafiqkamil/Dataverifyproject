from pydantic import BaseModel, ConfigDict

from .dataset import to_camel


class TestLayer(BaseModel):
    name: str
    status: str  # "done" | "pending"


class EvalCard(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    domain: str
    domain_color: str
    data_type: str
    miner: str
    submitted: str
    stage: str  # "Screener 1" | "Screener 2" | "Full Validation"
    priority: str  # "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
    note: str | None
    layers: list[TestLayer]


class ValidatorStatItem(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    label: str
    value: str
    sub: str
    color: str
    bg: str
    border: str
    sparkline: list[float]
    is_tao: bool


class PendingValidation(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    domain: str
    domain_color: str
    domain_bg: str
    miner: str
    submitted_ago: str
    est_time: str
    priority: str
    data_type: str
    size: str
    generation_method: str
    privacy_score: int


class Review(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    domain: str
    domain_color: str
    data_type: str
    my_score: int
    consensus: float
    match: str  # "Match" | "Outlier" | "Disputed"
    reward: float
    reward_note: str | None
    date: str
    status: str  # "Verified" | "Rejected" | "Disputed"
    note: str | None
    has_dispute: bool


class DimensionAverage(BaseModel):
    name: str
    avg: float


class ConsensusRow(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    domain: str
    domain_color: str
    my_score: int
    shapley: float
    deviation: float
    result: str  # "Aligned" | "Outlier" | "Disputed"
    weight_impact: str
    note: str | None


class ValidatorTxRow(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    date: str
    dataset_id: str
    reward_type: str
    amount: float
    multiplier: str
    tx_hash: str
    reduced: bool = False
    note: str | None = None


class ValidatorEarningsData(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    total_earned: float
    this_epoch: float
    avg_per_eval: float
    transactions: list[ValidatorTxRow]
    domain_breakdown: list[dict]
