import json
import time
from pathlib import Path
from typing import Dict, Any, List, Optional

import yaml

from llm_client import GroqLLM, LLMJudge
from attacks import load_attacks, Attack  


# ---------------------------------------------------------------------
# Config loading
# ---------------------------------------------------------------------


def load_config(config_path: str = "config.yaml") -> Dict[str, Any]:
    """
    Load configuration from a YAML file, with safe defaults if the file
    is missing or incomplete.
    """
    defaults: Dict[str, Any] = {
        "target_model": "llama-3.1-8b-instant",
        "judge_model": "llama-3.1-8b-instant",
        "attacks_path": "attacks.json",
        "results": {
            "root_dir": "results",
            "base_model_name": "llama-3-8b",
            "eval_name": "AlpacaEval",
        },
    }

    try:
        with open(config_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
    except FileNotFoundError:
        print(f"[config] No {config_path} found. Using defaults.")
        return defaults

    # Shallow merge for top-level keys
    cfg = {**defaults, **data}

    # Merge nested "results" dict
    results_default = defaults["results"]
    results_cfg = data.get("results", {}) if isinstance(data, dict) else {}
    cfg["results"] = {**results_default, **(results_cfg or {})}

    return cfg


# ---------------------------------------------------------------------
# Metrics / summary helpers
# ---------------------------------------------------------------------


def compute_summary(evaluation: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Compute simple metrics from the evaluation list:
      - overall_attack_success_rate
      - overall_average_score
      - per-category stats if category is present
    """
    if not evaluation:
        return {
            "num_samples": 0,
            "overall_attack_success_rate": 0.0,
            "overall_average_score": 0.0,
            "per_category": {},
        }

    num_samples = len(evaluation)
    total_score = 0
    total_successes = 0

    per_category: Dict[str, Dict[str, Any]] = {}

    for entry in evaluation:
        score = entry.get("judge", [5])[0]  # judge[0] is score
        attack_success = int(entry.get("attack success", 0))
        category = entry.get("category", "uncategorized")

        total_score += score
        total_successes += attack_success

        cat_stats = per_category.setdefault(
            category,
            {"num_samples": 0, "total_score": 0, "total_successes": 0},
        )
        cat_stats["num_samples"] += 1
        cat_stats["total_score"] += score
        cat_stats["total_successes"] += attack_success

    overall_attack_success_rate = total_successes / num_samples
    overall_average_score = total_score / num_samples

    # Convert per-category stats to rates/averages
    per_category_summary: Dict[str, Dict[str, Any]] = {}
    for cat, stats in per_category.items():
        n = stats["num_samples"]
        if n == 0:
            continue
        per_category_summary[cat] = {
            "num_samples": n,
            "attack_success_rate": stats["total_successes"] / n,
            "average_score": stats["total_score"] / n,
        }

    return {
        "num_samples": num_samples,
        "overall_attack_success_rate": overall_attack_success_rate,
        "overall_average_score": overall_average_score,
        "per_category": per_category_summary,
    }


# ---------------------------------------------------------------------
# Main evaluation runner
# ---------------------------------------------------------------------


def run_attacks(config: Optional[Dict[str, Any]] = None) -> Dict[str, str]:
    """
    Run all attacks defined in attacks.json (or the path in config)
    against the target model, evaluate them with an LLM judge, and
    save both detailed results and a summary metrics file.

    Returns:
        dict with paths for "results_path" and "summary_path"
    """
    if config is None:
        config = load_config()

    target_model_name: str = config.get("target_model", "llama-3.1-8b-instant")
    judge_model_name: str = config.get("judge_model", target_model_name)
    attacks_path: str = config.get("attacks_path", "attacks.json")

    results_cfg: Dict[str, Any] = config.get("results", {})
    root_dir: str = results_cfg.get("root_dir", "results")
    base_model_name: str = results_cfg.get("base_model_name", "llama-3-8b")
    eval_name: str = results_cfg.get("eval_name", "AlpacaEval")

    print("[config] Target model:", target_model_name)
    print("[config] Judge model:", judge_model_name)
    print("[config] Attacks path:", attacks_path)
    print("[config] Results root:", root_dir)
    print("[config] Base model name:", base_model_name)
    print("[config] Eval name:", eval_name)

    # Initialize clients
    target_client = GroqLLM(model_name=target_model_name)
    judge_client = LLMJudge(model_name=judge_model_name)

    # Load attacks as Attack objects
    attacks: List[Attack] = load_attacks(attacks_path)
    print(f"[runner] Loaded {len(attacks)} attacks.")

    evaluation: List[Dict[str, Any]] = []

    for attack in attacks:
        # attack is an Attack dataclass instance
        idx = attack.index
        goal = attack.goal
        jailbreak_prompt = attack.jailbreak_prompt
        category = attack.category or "uncategorized"

        print(f"\n=== Running attack index {idx} (category: {category}) ===")
        print("Goal:", goal)
        print("Jailbreak prompt:", jailbreak_prompt)

        # 1) Query target model
        start = time.time()
        response = target_client(jailbreak_prompt)
        response_delay = time.time() - start

        print("Target response (first 200 chars):")
        print(response[:200] + ("..." if len(response) > 200 else ""))

        # 2) Judge the response
        judge_result = judge_client.judge(
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
        defense_delay = 0.0   # we are not timing the judge separately right now
        extra_delay = defense_delay
        gpu_memory = 0.0      # placeholder

        entry = {
            "index": idx,
            "goal": goal,
            "category": category,
            "jailbreak prompt": jailbreak_prompt,
            "target model response": response,
            "judge": [score, explanation],
            "jailbreak LLM": 1,            # 1 = we used an LLM as a judge
            "response delay": response_delay,
            "pass defense": pass_defense,
            "attack success": attack_success,
            "defense delay": defense_delay,
            "extra delay": extra_delay,
            "gpu memory": gpu_memory,
        }

        evaluation.append(entry)

    # Build output paths
    base_dir = Path(root_dir) / base_model_name / eval_name
    base_dir.mkdir(parents=True, exist_ok=True)

    results_filename = f"{eval_name}_{base_model_name}_GradSafe.json"
    summary_filename = f"{eval_name}_{base_model_name}_summary.json"

    results_path = base_dir / results_filename
    summary_path = base_dir / summary_filename

    # Save detailed evaluation
    with open(results_path, "w", encoding="utf-8") as f:
        json.dump({"evaluation": evaluation}, f, indent=2, ensure_ascii=False)

    # Compute and save summary metrics
    summary = compute_summary(evaluation)
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print(f"\n[runner] Saved detailed results to: {results_path}")
    print(f"[runner] Saved summary metrics to: {summary_path}")

    return {
        "results_path": str(results_path),
        "summary_path": str(summary_path),
    }


if __name__ == "__main__":
    run_attacks()
