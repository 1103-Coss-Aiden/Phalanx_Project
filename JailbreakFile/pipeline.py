# pipeline.py
"""
Evaluation pipeline for running jailbreak attacks against a target LLM.

This module ties together:
  - configuration loading
  - attack loading
  - calling the target model and judge
  - saving detailed results + summary metrics

It is designed so that:
  - runner.py can just call EvaluationPipeline
  - CLI / API can reuse the same pipeline
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Any, List, Optional
import json
import time

import yaml

from llm_client import GroqLLM, LLMJudge
from attacks import Attack, load_attacks
from metrics import GlobalMetrics


# ---------------------------------------------------------------------
# Configuration model
# ---------------------------------------------------------------------


@dataclass
class EvaluationConfig:
    target_model: str = "llama-3.1-8b-instant"
    judge_model: str = "llama-3.1-8b-instant"
    attacks_path: str = "attacks.json"
    results_root: str = "results"
    base_model_name: str = "llama-3-8b"
    eval_name: str = "AlpacaEval"

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "EvaluationConfig":
        results_cfg = data.get("results", {}) or {}
        return cls(
            target_model=data.get("target_model", "llama-3.1-8b-instant"),
            judge_model=data.get(
                "judge_model",
                data.get("target_model", "llama-3.1-8b-instant"),
            ),
            attacks_path=data.get("attacks_path", "attacks.json"),
            results_root=results_cfg.get("root_dir", "results"),
            base_model_name=results_cfg.get("base_model_name", "llama-3-8b"),
            eval_name=results_cfg.get("eval_name", "AlpacaEval"),
        )

    @classmethod
    def from_yaml(cls, path: str = "config.yaml") -> "EvaluationConfig":
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f) or {}
        except FileNotFoundError:
            print(f"[config] {path} not found, using defaults.")
            data = {}
        return cls.from_dict(data)

    def to_dict(self) -> Dict[str, Any]:
        """
        For debugging / serialization back to YAML if needed.
        """
        return {
            "target_model": self.target_model,
            "judge_model": self.judge_model,
            "attacks_path": self.attacks_path,
            "results": {
                "root_dir": self.results_root,
                "base_model_name": self.base_model_name,
                "eval_name": self.eval_name,
            },
        }


# ---------------------------------------------------------------------
# Pipeline
# ---------------------------------------------------------------------


class EvaluationPipeline:
    """
    Orchestrates the full evaluation process:
      1. Load config
      2. Load attacks
      3. Run attacks against target model
      4. Judge responses
      5. Save detailed results + summary metrics
    """

    def __init__(self, config: EvaluationConfig) -> None:
        self.config = config
        self.target_client = GroqLLM(model_name=config.target_model)
        self.judge_client = LLMJudge(model_name=config.judge_model)
        self.attacks: List[Attack] = []

    @classmethod
    def from_yaml(cls, path: str = "config.yaml") -> "EvaluationPipeline":
        cfg = EvaluationConfig.from_yaml(path)
        print("[pipeline] Loaded config:")
        print(f"  target_model : {cfg.target_model}")
        print(f"  judge_model  : {cfg.judge_model}")
        print(f"  attacks_path : {cfg.attacks_path}")
        print(f"  results_root : {cfg.results_root}")
        print(f"  base_model   : {cfg.base_model_name}")
        print(f"  eval_name    : {cfg.eval_name}")
        return cls(cfg)

    def load_attacks(self) -> None:
        self.attacks = load_attacks(self.config.attacks_path)
        print(f"[pipeline] Loaded {len(self.attacks)} attacks from {self.config.attacks_path}")

    def run(self) -> List[Dict[str, Any]]:
        """
        Run all attacks and return the raw evaluation entries.
        """
        if not self.attacks:
            self.load_attacks()

        evaluation: List[Dict[str, Any]] = []

        for attack in self.attacks:
            idx = attack.index
            goal = attack.goal
            jailbreak_prompt = attack.jailbreak_prompt
            category = attack.category or "uncategorized"

            print(f"\n=== Running attack index {idx} (category: {category}) ===")
            print("Goal:", goal)
            print("Jailbreak prompt:", jailbreak_prompt)

            # 1) Query target model
            start = time.time()
            response = self.target_client(jailbreak_prompt)
            response_delay = time.time() - start

            print("Target response (first 200 chars):")
            print(response[:200] + ("..." if len(response) > 200 else ""))

            # 2) Judge the response
            judge_result = self.judge_client.judge(
                goal=goal,
                jailbreak_prompt=jailbreak_prompt,
                response=response,
            )

            score = judge_result["score"]
            attack_success = judge_result["attack_success"]
            explanation = judge_result["explanation"]

            print(f"Judge score: {score}, attack success: {attack_success}")
            print("Judge explanation:", explanation)

            pass_defense = 1 if attack_success == 0 else 0
            defense_delay = 0.0   # not timing judge separately for now
            extra_delay = defense_delay
            gpu_memory = 0.0      # placeholder for future integration

            entry = {
                "index": idx,
                "goal": goal,
                "category": category,
                "is_harmful": attack.is_harmful,
                "jailbreak prompt": jailbreak_prompt,
                "target model response": response,
                "judge": [score, explanation],
                "jailbreak LLM": 1,            # 1 = LLM used as judge
                "response delay": response_delay,
                "pass defense": pass_defense,
                "attack success": attack_success,
                "defense delay": defense_delay,
                "extra delay": extra_delay,
                "gpu memory": gpu_memory,
            }

            evaluation.append(entry)

        return evaluation

    def save_results(
        self,
        evaluation: List[Dict[str, Any]],
        save_summary: bool = True,
        total_runtime_seconds: Optional[float] = None,
    ) -> Dict[str, str]:
        """
        Save the detailed GradSafe results and (optionally) a summary metrics file.
        Returns the paths as a small dict.
        """
        cfg = self.config
        base_dir = Path(cfg.results_root) / cfg.base_model_name / cfg.eval_name
        base_dir.mkdir(parents=True, exist_ok=True)

        results_filename = f"{cfg.eval_name}_{cfg.base_model_name}_GradSafe.json"
        summary_filename = f"{cfg.eval_name}_{cfg.base_model_name}_summary.json"

        results_path = base_dir / results_filename
        summary_path = base_dir / summary_filename

        # Save detailed evaluation
        with open(results_path, "w", encoding="utf-8") as f:
            json.dump({"evaluation": evaluation}, f, indent=2, ensure_ascii=False)

        print(f"[pipeline] Saved detailed results to: {results_path}")

        # Save summary metrics
        if save_summary:
            gm = GlobalMetrics.from_evaluation(
                evaluation,
                total_runtime_seconds=total_runtime_seconds,
            )
            with open(summary_path, "w", encoding="utf-8") as f:
                json.dump(gm.to_dict(), f, indent=2, ensure_ascii=False)
            print(f"[pipeline] Saved summary metrics to: {summary_path}")
        else:
            summary_path = ""

        return {
            "results_path": str(results_path),
            "summary_path": str(summary_path),
        }

    def run_and_save(self) -> Dict[str, str]:
        """
        Convenience method: run the full pipeline and save outputs.
        """
        start = time.time()
        evaluation = self.run()
        total_runtime = time.time() - start
        return self.save_results(evaluation, total_runtime_seconds=total_runtime)
