from pydantic import BaseModel, ConfigDict

from .dataset import to_camel


class SubmissionDimension(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    name: str
    score: int | None
    status: str  # "done" | "running" | "locked"


class SubmissionValidator(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    addr: str
    status: str  # "submitted" | "evaluating" | "waiting"


class Submission(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    domain: str
    domain_color: str
    data_type: str
    score: int | None
    status: str  # "Verified" | "In Review" | "Rejected" | "Pending"
    reward: float | None
    bonus: str | None
    date: str
    date_iso: str | None = None
    records: str
    file_size: str
    gen_method: str
    submitted_time: str
    estimated_completion: str | None
    screener1: str
    screener2: str
    full_validation: str
    validation_progress: int
    dimensions: list[SubmissionDimension]
    validators: list[SubmissionValidator]


class RoyaltyRecord(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    domain: str
    sold: int
    royalty: float
    last_sale: str
    status: str


class PieSlice(BaseModel):
    name: str
    value: float
    color: str


class PayoutRecord(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    date: str
    epoch: int
    type: str
    dataset: str
    amount: float
    hash: str


class MinerEarningsData(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    total_earned: float
    this_epoch: float
    royalty_income: float
    chart: list[dict]
    pie: list[PieSlice]
    royalties: list[RoyaltyRecord]
    payouts: list[PayoutRecord]


class MinerDashboardStats(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    datasets_submitted: str
    quality_avg: str
    total_earned: str
    active_requests: str


class SubmitFormData(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    dataset_name: str
    domain: str
    data_type: str = "Tabular"
    description: str = ""
    dataset_size: str = ""
    generation_method: str = ""
    intended_use_case: str = ""
    feature_count: str = ""
    target_columns: str = ""
    train_test_split: int = 80
    missing_value_strategy: str = ""
    normalization: str = ""
    evaluation_metrics: list[str] = []
    class_balance: str = ""
    differential_privacy: bool = True
    epsilon: float = 1.0
    delta: float = 5.0
    k_anonymity: int = 5
    l_diversity: bool = True
    t_closeness: bool = False
    pii_scan: bool = True
    adversarial_testing: bool = True
    synthetic_guarantee: str = ""
    membership_inference: bool = True
    agreed_to_terms: bool = False
    agreed_to_data_policy: bool = False
    public_listing: bool = True
