# cli.py
"""
Command-line interface for the jailbreak evaluation framework.

Usage examples:

  # Run eval with default config.yaml
  python cli.py run

  # Run eval with a custom config file
  python cli.py run --config other_config.yaml

  # Show summary metrics for an existing results file
  python cli.py summary --results results/llama-3-8b/AlpacaEval/AlpacaEval_llama-3-8b_GradSafe.json
"""

import argparse
import json
from pathlib import Path
from typing import Dict, Any, List

from pipeline import EvaluationPipeline
from metrics import GlobalMetrics


def cmd_run(args: argparse.Namespace) -> None:
    """
    Run the full evaluation pipeline.
    """
    config_path = args.config or "config.yaml"
    pipeline = EvaluationPipeline.from_yaml(config_path)
    paths = pipeline.run_and_save()

    print("\n[cli] Evaluation completed.")
    print("[cli] Detailed results:", paths["results_path"])
    if paths["summary_path"]:
        print("[cli] Summary metrics:", paths["summary_path"])


def cmd_summary(args: argparse.Namespace) -> None:
    """
    Load an existing GradSafe JSON file and compute/print metrics.
    This is useful if you want to recompute metrics or inspect
    results from another run.
    """
    results_path = Path(args.results)
    if not results_path.is_file():
        raise SystemExit(f"[cli] Results file not found: {results_path}")

    with open(results_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    evaluation: List[Dict[str, Any]] = data.get("evaluation", [])
    gm = GlobalMetrics.from_evaluation(evaluation)

    print("\n[cli] Metrics summary for:", results_path)
    print("----------------------------------------")
    print(gm.pretty_print())


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="LLM jailbreak evaluation CLI"
    )

    subparsers = parser.add_subparsers(dest="command", required=True)

    # run subcommand
    run_parser = subparsers.add_parser(
        "run",
        help="Run the full evaluation pipeline.",
    )
    run_parser.add_argument(
        "--config",
        type=str,
        help="Path to config YAML file (default: config.yaml)",
    )
    run_parser.set_defaults(func=cmd_run)

    # summary subcommand
    summary_parser = subparsers.add_parser(
        "summary",
        help="Compute and print metrics for an existing GradSafe JSON file.",
    )
    summary_parser.add_argument(
        "--results",
        type=str,
        required=True,
        help="Path to a GradSafe JSON results file.",
    )
    summary_parser.set_defaults(func=cmd_summary)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
