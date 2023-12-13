# coding: utf-8

"""
    kraken

    The core component of kraken-project

    The version of the OpenAPI document: 0.1.0
    Contact: git@omikron.dev
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


from __future__ import annotations
import pprint
import re  # noqa: F401
import json


from typing import Any, ClassVar, Dict, List
from pydantic import BaseModel, StrictStr, field_validator
from pydantic import Field
from kraken_sdk.models.aggregation_type import AggregationType
try:
    from typing import Self
except ImportError:
    from typing_extensions import Self

class WsMessageOneOf17(BaseModel):
    """
    Workspace tags were updated on an aggregation
    """ # noqa: E501
    workspace: StrictStr = Field(description="The workspace the aggregation is related to")
    aggregation: AggregationType
    uuid: StrictStr = Field(description="The uuid of the model")
    tags: List[StrictStr] = Field(description="The updated list of tags")
    type: StrictStr
    __properties: ClassVar[List[str]] = ["workspace", "aggregation", "uuid", "tags", "type"]

    @field_validator('type')
    def type_validate_enum(cls, value):
        """Validates the enum"""
        if value not in ('UpdatedWorkspaceTags'):
            raise ValueError("must be one of enum values ('UpdatedWorkspaceTags')")
        return value

    model_config = {
        "populate_by_name": True,
        "validate_assignment": True
    }


    def to_str(self) -> str:
        """Returns the string representation of the model using alias"""
        return pprint.pformat(self.model_dump(by_alias=True))

    def to_json(self) -> str:
        """Returns the JSON representation of the model using alias"""
        # TODO: pydantic v2: use .model_dump_json(by_alias=True, exclude_unset=True) instead
        return json.dumps(self.to_dict())

    @classmethod
    def from_json(cls, json_str: str) -> Self:
        """Create an instance of WsMessageOneOf17 from a JSON string"""
        return cls.from_dict(json.loads(json_str))

    def to_dict(self) -> Dict[str, Any]:
        """Return the dictionary representation of the model using alias.

        This has the following differences from calling pydantic's
        `self.model_dump(by_alias=True)`:

        * `None` is only added to the output dict for nullable fields that
          were set at model initialization. Other fields with value `None`
          are ignored.
        """
        _dict = self.model_dump(
            by_alias=True,
            exclude={
            },
            exclude_none=True,
        )
        return _dict

    @classmethod
    def from_dict(cls, obj: Dict) -> Self:
        """Create an instance of WsMessageOneOf17 from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "workspace": obj.get("workspace"),
            "aggregation": obj.get("aggregation"),
            "uuid": obj.get("uuid"),
            "tags": obj.get("tags"),
            "type": obj.get("type")
        })
        return _obj


