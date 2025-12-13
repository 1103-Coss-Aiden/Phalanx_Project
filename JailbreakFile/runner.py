# runner.py
"""
Thin wrapper to run the evaluation pipeline using the default config.
You can still call EvaluationPipeline directly from CLI or tests.
"""

from pipeline import EvaluationPipeline


if __name__ == "__main__":
    pipeline = EvaluationPipeline.from_yaml("config.yaml")
    pipeline.run_and_save()
