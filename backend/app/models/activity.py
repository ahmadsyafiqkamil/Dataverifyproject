from pydantic import BaseModel, ConfigDict

from .dataset import to_camel


class ActivityRecord(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    name: str
    domain: str
    domain_color: str
    score: int
    status: str  # "Completed" | "Processing" | "Failed" | "Pending"
    date: str
    tao: str


class PurchaseRow(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    date: str
    order_id: str
    dataset_id: str
    domain: str
    data_type: str
    quality_score: int | None
    amount: float
    license: str
    status: str  # "Completed" | "Processing" | "Refunded"
    tag: str | None = None
    note: str | None = None
    dispute_link: bool = False


class ActiveLicense(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    dataset_id: str
    domain: str
    data_type: str
    score: int
    license: str
    expires: str
    downloads: str


class PreviousRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    domain: str
    domain_color: str
    status: str
    status_color: str
    status_bg: str
    status_border: str
    meta: str
