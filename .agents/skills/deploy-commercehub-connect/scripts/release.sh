#!/usr/bin/env bash
#
# Reusable release driver for the CommerceHub Connect Wallet SDK.
#
# Builds the SDK from a disposable detached worktree so the developer's working
# tree is never mutated, then either stages artifacts locally (--prepare) or
# publishes docs and the GitHub release (--publish).
#
# All paths are overridable through environment variables:
#   SDK_REPO       path to this SDK checkout            (default: repo root of this script)
#   CONNECT_REPO   path to the public commerce-hub/connect checkout
#   SOURCE_REF     git ref to release from              (default: feature/wallet-sdk-0.9.10)
#   CONNECT_REMOTE git URL for the public docs repo
#   GH_REPO        GitHub repo slug for releases        (default: commerce-hub/connect)
#   EXPORT_ROOT    where --prepare writes artifacts     (default: $SDK_REPO/exports/releases)
#
# Usage:
#   scripts/release.sh --prepare
#   scripts/release.sh --publish
#   scripts/release.sh --prepare --source-ref main --dry-run

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_SDK_REPO="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

SDK_REPO="${SDK_REPO:-$DEFAULT_SDK_REPO}"
CONNECT_REPO="${CONNECT_REPO:-$(cd "$SDK_REPO/.." && pwd)/connect}"
SOURCE_REF="${SOURCE_REF:-feature/wallet-sdk-0.9.10}"
CONNECT_REMOTE="${CONNECT_REMOTE:-https://github.com/commerce-hub/connect}"
GH_REPO="${GH_REPO:-commerce-hub/connect}"
EXPORT_ROOT="${EXPORT_ROOT:-$SDK_REPO/exports/releases}"
CONNECT_BRANCH="${CONNECT_BRANCH:-main}"

MODE=""
DRY_RUN=0

die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

log() {
  printf '\n==> %s\n' "$*"
}

run() {
  printf '    $ %s\n' "$*"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    return 0
  fi
  "$@"
}

usage() {
  cat <<'EOF'
Usage: release.sh (--prepare | --publish) [options]

Modes:
  --prepare            Build in a disposable worktree and copy artifacts into
                       exports/releases/v<version>/ (git-ignored). No remote writes.
  --publish            Everything --prepare does, plus clone/update the public
                       connect repo, publish docs, and create/upload the GitHub release.

Options:
  --source-ref <ref>   Git ref to build from (default: feature/wallet-sdk-0.9.10)
  --sdk-repo <path>    SDK checkout to build from
  --connect-repo <path>
                       Local path for the public connect checkout
  --gh-repo <slug>     GitHub repo used for releases (default: commerce-hub/connect)
  --dry-run            Print commands without executing side effects
  -h, --help           Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --prepare)
      [[ -n "$MODE" && "$MODE" != "prepare" ]] && die "--prepare and --publish are mutually exclusive"
      MODE="prepare"
      ;;
    --publish)
      [[ -n "$MODE" && "$MODE" != "publish" ]] && die "--prepare and --publish are mutually exclusive"
      MODE="publish"
      ;;
    --source-ref)
      SOURCE_REF="${2:?--source-ref requires a value}"
      shift
      ;;
    --sdk-repo)
      SDK_REPO="${2:?--sdk-repo requires a value}"
      shift
      ;;
    --connect-repo)
      CONNECT_REPO="${2:?--connect-repo requires a value}"
      shift
      ;;
    --gh-repo)
      GH_REPO="${2:?--gh-repo requires a value}"
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      usage >&2
      die "unknown argument: $1"
      ;;
  esac
  shift
done

[[ -n "$MODE" ]] || { usage >&2; die "one of --prepare or --publish is required"; }

for tool in git npm rsync; do
  command -v "$tool" >/dev/null 2>&1 || die "required tool not found: $tool"
done
if [[ "$MODE" == "publish" ]]; then
  command -v gh >/dev/null 2>&1 || die "required tool not found: gh"
fi

[[ -d "$SDK_REPO/.git" || -f "$SDK_REPO/.git" ]] || die "not a git checkout: $SDK_REPO"
git -C "$SDK_REPO" rev-parse --verify --quiet "$SOURCE_REF^{commit}" >/dev/null \
  || die "source ref not found in $SDK_REPO: $SOURCE_REF"

SOURCE_SHA="$(git -C "$SDK_REPO" rev-parse "$SOURCE_REF")"
WORKTREE_DIR="$(mktemp -d "${TMPDIR:-/tmp}/chc-release-XXXXXX")"

cleanup() {
  local exit_code=$?
  if [[ -d "$WORKTREE_DIR" ]]; then
    log "Cleaning up temporary worktree"
    git -C "$SDK_REPO" worktree remove --force "$WORKTREE_DIR" >/dev/null 2>&1 || true
    rm -rf "$WORKTREE_DIR"
    git -C "$SDK_REPO" worktree prune >/dev/null 2>&1 || true
  fi
  exit "$exit_code"
}
trap cleanup EXIT INT TERM

log "Release configuration"
cat <<EOF
    mode:          $MODE
    sdk repo:      $SDK_REPO
    source ref:    $SOURCE_REF ($SOURCE_SHA)
    connect repo:  $CONNECT_REPO
    connect remote:$CONNECT_REMOTE
    gh repo:       $GH_REPO
    worktree:      $WORKTREE_DIR
    dry run:       $DRY_RUN
EOF

log "Creating disposable detached worktree"
rmdir "$WORKTREE_DIR"
git -C "$SDK_REPO" worktree add --detach "$WORKTREE_DIR" "$SOURCE_SHA"

VERSION="$(node -p "require('$WORKTREE_DIR/package.json').version")"
[[ -n "$VERSION" ]] || die "unable to read version from worktree package.json"
TAG="v$VERSION"
TARBALL="commerce-hub-connect-sdk-$VERSION.tgz"
EXPORT_DIR="$EXPORT_ROOT/$TAG"

log "Building $TAG from $SOURCE_REF"
run npm --prefix "$WORKTREE_DIR" ci
(cd "$WORKTREE_DIR" && run npm run build)
(cd "$WORKTREE_DIR" && run npm run pack:dist)
(cd "$WORKTREE_DIR" && run npm run docs)

if [[ "$DRY_RUN" -eq 0 ]]; then
  [[ -f "$WORKTREE_DIR/dist/$TARBALL" ]] || die "expected tarball missing: dist/$TARBALL"
  [[ -d "$WORKTREE_DIR/docs" ]] || die "expected docs output missing: docs/"
fi

log "Staging artifacts in $EXPORT_DIR"
run mkdir -p "$EXPORT_DIR"
run rsync -a --delete "$WORKTREE_DIR/docs/" "$EXPORT_DIR/docs/"
run cp "$WORKTREE_DIR/dist/$TARBALL" "$EXPORT_DIR/$TARBALL"

if [[ "$DRY_RUN" -eq 0 ]]; then
  DIGEST="$(shasum -a 256 "$EXPORT_DIR/$TARBALL" | awk '{print $1}')"
  cat >"$EXPORT_DIR/RELEASE_INFO.txt" <<EOF
tag=$TAG
version=$VERSION
source_ref=$SOURCE_REF
source_sha=$SOURCE_SHA
tarball=$TARBALL
sha256=$DIGEST
built_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF
  printf '    sha256: %s\n' "$DIGEST"
fi

if [[ "$MODE" == "prepare" ]]; then
  log "Prepared $TAG"
  printf '    artifacts: %s\n' "$EXPORT_DIR"
  printf '    publish with: %s --publish --source-ref %s\n' "$0" "$SOURCE_REF"
  exit 0
fi

log "Syncing public docs repo at $CONNECT_REPO"
if [[ -d "$CONNECT_REPO/.git" ]]; then
  run git -C "$CONNECT_REPO" fetch origin "$CONNECT_BRANCH"
  if [[ "$DRY_RUN" -eq 0 && -n "$(git -C "$CONNECT_REPO" status --porcelain)" ]]; then
    die "public repo has local changes; resolve them before publishing: $CONNECT_REPO"
  fi
  run git -C "$CONNECT_REPO" checkout "$CONNECT_BRANCH"
  run git -C "$CONNECT_REPO" reset --hard "origin/$CONNECT_BRANCH"
else
  run git clone "$CONNECT_REMOTE" "$CONNECT_REPO"
  run git -C "$CONNECT_REPO" checkout "$CONNECT_BRANCH"
fi

log "Publishing docs"
run rsync -a --delete "$WORKTREE_DIR/docs/" "$CONNECT_REPO/docs/"
run git -C "$CONNECT_REPO" add docs
if [[ "$DRY_RUN" -eq 1 ]] || ! git -C "$CONNECT_REPO" diff --cached --quiet; then
  run git -C "$CONNECT_REPO" commit -m "$VERSION"
  run git -C "$CONNECT_REPO" push origin "$CONNECT_BRANCH"
else
  printf '    docs already up to date; nothing to commit\n'
fi

log "Creating or updating GitHub release $TAG"
if [[ "$DRY_RUN" -eq 1 ]]; then
  printf '    $ gh release create %s %s --repo %s ...\n' "$TAG" "$EXPORT_DIR/$TARBALL" "$GH_REPO"
elif gh release view "$TAG" --repo "$GH_REPO" >/dev/null 2>&1; then
  if gh release view "$TAG" --repo "$GH_REPO" --json assets \
    --jq '.assets[].name' | grep -Fxq "$TARBALL"; then
    printf '    asset already present; not clobbering %s\n' "$TARBALL"
  else
    gh release upload "$TAG" "$EXPORT_DIR/$TARBALL" --repo "$GH_REPO"
  fi
else
  gh release create "$TAG" "$EXPORT_DIR/$TARBALL" \
    --repo "$GH_REPO" \
    --target "$CONNECT_BRANCH" \
    --title "$TAG" \
    --notes "commerce-hub-connect-sdk $VERSION"
fi

log "Verifying release"
if [[ "$DRY_RUN" -eq 0 ]]; then
  gh release view "$TAG" --repo "$GH_REPO" --json tagName,url,targetCommitish,assets
  printf '    local sha256: %s\n' "$DIGEST"
fi

log "Published $TAG"
