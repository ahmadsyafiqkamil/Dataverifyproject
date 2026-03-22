from pydantic import BaseModel, ConfigDict

from .dataset import to_camel


class NetworkStatus(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    status: str
    validators: str
    block: str


class MinerSubnetStatus(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    status: str
    block: str
    emissions: str
    my_stake: str
    subnet_uid: str
    miners: str
    my_uid: str
    incentive: str


class ValidatorSubnetStatus(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    status: str
    block: str
    epoch: str
    emissions: str
    my_stake: str
    subnet_uid: str
    validators: str
    my_uid: str
    trust_score: str
    vtrust: str
