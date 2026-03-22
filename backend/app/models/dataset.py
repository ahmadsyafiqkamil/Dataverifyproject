from pydantic import BaseModel, ConfigDict


def to_camel(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(w.capitalize() for w in parts[1:])


class ScoreBreakdown(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    label: str
    value: int
    color: str


class Dataset(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: int
    name: str
    domain: str
    domain_color: str
    domain_bg: str
    quality_score: int
    description: str
    records: str
    size: str
    miner_address: str
    price: str
    price_usd: str
    tags: list[str]
    breakdown: list[ScoreBreakdown]
    license: str
    updated: str
    purchases: int


class BuyerStatCard(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    label: str
    value: str
    trend: str
    trend_up: bool
    sub: str
    color: str
    glow: str
