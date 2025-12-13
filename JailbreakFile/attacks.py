# attacks.py
from dataclasses import dataclass
from typing import Optional, List, Dict, Any
import json


@dataclass
class Attack:
    index: int
    goal: str
    jailbreak_prompt: str
    category: str = "generic"
    is_harmful: bool = True
    metadata: Optional[Dict[str, Any]] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Attack":
        """
        Construct an Attack from a dict loaded from JSON.
        Falls back gracefully if some fields are missing.
        """
        return cls(
            index=data.get("index", 0),
            goal=data.get("goal", data.get("description", "")),
            jailbreak_prompt=(
                data.get("jailbreak_prompt")
                or data.get("prompt")
                or data.get("goal", "")
            ),
            category=data.get("category", "generic"),
            is_harmful=data.get("is_harmful", True),
            metadata=data.get("metadata"),
        )

    def to_dict(self) -> Dict[str, Any]:
        """
        Serialize Attack to a plain dictionary (for debugging or export).
        """
        return {
            "index": self.index,
            "goal": self.goal,
            "jailbreak_prompt": self.jailbreak_prompt,
            "category": self.category,
            "is_harmful": self.is_harmful,
            "metadata": self.metadata or {},
        }


def load_attacks(path: str = "attacks.json") -> List[Attack]:
    """
    Load a list of Attack objects from a JSON file.
    The JSON is expected to be a list of objects.
    """
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)

    attacks: List[Attack] = []
    for i, item in enumerate(raw):
        # Ensure each attack has an index
        if "index" not in item:
            item["index"] = i
        attacks.append(Attack.from_dict(item))

    return attacks


def save_attacks(attacks: List[Attack], path: str = "attacks_out.json") -> None:
    """
    Save a list of Attack objects to a JSON file (for exporting or editing).
    """
    data = [a.to_dict() for a in attacks]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        