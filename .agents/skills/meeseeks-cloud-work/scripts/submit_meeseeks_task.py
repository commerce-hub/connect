#!/usr/bin/env python3
"""Submit a work item to the Meeseeks cloud worker service."""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request


DEFAULT_ENDPOINT = "https://meeseek.clx-nonprod.aws.fisv.cloud/"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Submit a Meeseeks cloud work request."
    )
    parser.add_argument(
        "--endpoint",
        default=DEFAULT_ENDPOINT,
        help=f"Meeseeks endpoint. Defaults to {DEFAULT_ENDPOINT}",
    )
    parser.add_argument(
        "--repo-path",
        required=True,
        help="Git repository URL for Meeseeks to clone.",
    )
    parser.add_argument(
        "--jira-id",
        required=True,
        help="Stable short identifier for the work item.",
    )
    description_group = parser.add_mutually_exclusive_group(required=True)
    description_group.add_argument(
        "--jira-description",
        help="Full plan or task description to send to Meeseeks.",
    )
    description_group.add_argument(
        "--jira-description-file",
        help="Path to a UTF-8 text file containing the plan or task description.",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=60.0,
        help="Request timeout in seconds. Defaults to 60.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the JSON payload and do not submit the request.",
    )
    return parser.parse_args()


def read_description(args: argparse.Namespace) -> str:
    if args.jira_description_file:
        with open(args.jira_description_file, "r", encoding="utf-8") as handle:
            return handle.read()

    return args.jira_description


def build_payload(args: argparse.Namespace) -> dict[str, str]:
    return {
        "repo_path": args.repo_path,
        "jira_id": args.jira_id,
        "jira_description": read_description(args),
    }


def submit(endpoint: str, payload: dict[str, str], timeout: float) -> int:
    request = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            body = response.read().decode("utf-8", errors="replace")
            print(f"HTTP {response.status} {response.reason}")
            print(body)
            return 0
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        print(f"HTTP {exc.code} {exc.reason}", file=sys.stderr)
        print(body, file=sys.stderr)
        return 1
    except Exception as exc:
        print(f"REQUEST_FAILED {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1


def main() -> int:
    args = parse_args()
    payload = build_payload(args)

    if args.dry_run:
        print(json.dumps(payload, indent=2, sort_keys=True))
        return 0

    return submit(args.endpoint, payload, args.timeout)


if __name__ == "__main__":
    raise SystemExit(main())
