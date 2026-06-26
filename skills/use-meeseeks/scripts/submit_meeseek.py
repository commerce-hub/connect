#!/usr/bin/env python3
"""Submit a task to the Meeseeks cloud worker endpoint."""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request


DEFAULT_ENDPOINT = "https://meeseek.clx-nonprod.aws.fisv.cloud/"
DEFAULT_REPO_PATH = (
    "https://gitlab.onefiserv.net/na/gbs/carat-digital-ecommerce/"
    "ms-agentic-commerce-msac/commercehub-connect-wallet-sdk"
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Submit a JSON task payload to the Meeseeks endpoint."
    )
    parser.add_argument("--jira-id", required=True, help="Task identifier.")
    parser.add_argument(
        "--description",
        help="Task description text. Mutually exclusive with --description-file.",
    )
    parser.add_argument(
        "--description-file",
        help="Path to a UTF-8 file containing the task description.",
    )
    parser.add_argument(
        "--repo-path",
        default=DEFAULT_REPO_PATH,
        help=f"Repository URL. Default: {DEFAULT_REPO_PATH}",
    )
    parser.add_argument(
        "--endpoint",
        default=DEFAULT_ENDPOINT,
        help=f"Meeseeks endpoint. Default: {DEFAULT_ENDPOINT}",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=60,
        help="HTTP timeout in seconds. Default: 60.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the JSON payload without sending it.",
    )
    args = parser.parse_args()

    if bool(args.description) == bool(args.description_file):
        parser.error("Provide exactly one of --description or --description-file.")

    return args


def read_description(args: argparse.Namespace) -> str:
    if args.description_file:
        with open(args.description_file, "r", encoding="utf-8") as file:
            return file.read()

    return args.description


def build_payload(args: argparse.Namespace) -> dict[str, str]:
    return {
        "repo_path": args.repo_path,
        "jira_id": args.jira_id,
        "jira_description": read_description(args),
    }


def submit(endpoint: str, payload: dict[str, str], timeout: float) -> tuple[int, str, str]:
    body = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        endpoint,
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Content-Length": str(len(body)),
        },
    )

    with urllib.request.urlopen(request, timeout=timeout) as response:
        response_body = response.read().decode("utf-8", errors="replace")
        return response.status, response.reason, response_body


def main() -> int:
    args = parse_args()
    payload = build_payload(args)

    if args.dry_run:
        print(json.dumps(payload, indent=2))
        return 0

    try:
        status, reason, response_body = submit(
            args.endpoint, payload, args.timeout
        )
    except urllib.error.HTTPError as error:
        response_body = error.read().decode("utf-8", errors="replace")
        print(f"HTTP {error.code} {error.reason}", file=sys.stderr)
        print(response_body, file=sys.stderr)
        return 1
    except Exception as error:
        print(f"ERROR {type(error).__name__}: {error}", file=sys.stderr)
        return 1

    print(f"HTTP {status} {reason}")
    print(response_body)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
