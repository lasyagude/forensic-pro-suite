from __future__ import annotations

import json
import sys

from engine import ForensicEngine


def main() -> int:
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: worker_runner.py <evidence_path>"}), file=sys.stderr)
        return 2

    evidence_path = sys.argv[1]
    report = ForensicEngine(evidence_path).run_automated_process()
    print(json.dumps(report))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
