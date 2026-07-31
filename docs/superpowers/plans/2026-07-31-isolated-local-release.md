# Isolated Local Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a safe local release command that builds committed `feature/wallet-sdk-0.9.10` in a disposable worktree, retains inspectable artifacts, and publishes only when explicitly requested.

**Architecture:** A Bash entry point owns source-ref resolution, temporary-worktree lifecycle, artifact preparation, and optional publication. The active SDK checkout is used only as a Git control directory and ignored artifact destination; all dependency installation and build mutation occur inside the detached worktree. A focused Node test protects paths, modes, and deployment-skill routing, while a real `--prepare` integration run proves isolation.

**Tech Stack:** Bash, Git worktrees, npm, TypeScript build, Eleventy/Rollup docs build, rsync, GitHub CLI, Node test runner

---

### Task 1: Add the release command contract test

**Files:**
- Create: `dev/deploy-commercehub-connect-skill_test.js`
- Test: `dev/deploy-commercehub-connect-skill_test.js`

- [ ] **Step 1: Write the failing contract test**

```js
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {readFile, stat} from 'node:fs/promises';
import test from 'node:test';

const skillPath = '.agents/skills/deploy-commercehub-connect/SKILL.md';
const scriptPath =
  '.agents/skills/deploy-commercehub-connect/scripts/release.sh';

test('deployment skill routes releases through the isolated command', async () => {
  const [skill, script, scriptStat] = await Promise.all([
    readFile(skillPath, 'utf8'),
    readFile(scriptPath, 'utf8'),
    stat(scriptPath),
  ]);

  assert.equal(scriptStat.mode & 0o111, 0o111);
  assert.doesNotMatch(skill, /\/Users\/neer\.patel/u);
  assert.doesNotMatch(script, /\/Users\/neer\.patel/u);
  assert.match(skill, /scripts\/release\.sh --prepare/u);
  assert.match(skill, /scripts\/release\.sh --publish/u);
  assert.match(script, /feature\/wallet-sdk-0\.9\.10/u);
  assert.match(script, /https:\/\/github\.com\/commerce-hub\/connect/u);
});

test('release command documents modes and rejects unknown modes', () => {
  const help = execFileSync(scriptPath, ['--help'], {encoding: 'utf8'});
  const invalid = spawnSync(scriptPath, ['--unknown'], {encoding: 'utf8'});

  assert.match(help, /--prepare/u);
  assert.match(help, /--publish/u);
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /Unknown mode/u);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test dev/deploy-commercehub-connect-skill_test.js`

Expected: FAIL with `ENOENT` for `.agents/skills/deploy-commercehub-connect/scripts/release.sh`.

- [ ] **Step 3: Commit the failing test**

```bash
git add dev/deploy-commercehub-connect-skill_test.js
git commit -m "test: define isolated SDK release contract"
```

### Task 2: Implement isolated prepare and explicit publish modes

**Files:**
- Create: `.agents/skills/deploy-commercehub-connect/scripts/release.sh`
- Test: `dev/deploy-commercehub-connect-skill_test.js`

- [ ] **Step 1: Add the release script**

Create the executable script with this implementation:

```bash
#!/usr/bin/env bash
set -Eeuo pipefail

DEFAULT_SDK_REPO="/Users/unnikrishnan.b/Documents/Projects/NorthAm/repo/commercehub-connect-wallet-sdk"
DEFAULT_CONNECT_REPO="/Users/unnikrishnan.b/Documents/Projects/NorthAm/repo/connect"
DEFAULT_CONNECT_REMOTE_URL="https://github.com/commerce-hub/connect"
DEFAULT_SOURCE_REF="feature/wallet-sdk-0.9.10"
DEFAULT_PUBLIC_BRANCH="main"
GITHUB_REPOSITORY="commerce-hub/connect"

usage() {
  printf '%s\n' \
    'Usage: release.sh --prepare | --publish' \
    '' \
    '  --prepare  Build in a detached worktree and retain local artifacts.' \
    '  --publish  Build, publish generated docs, and create/upload the release asset.'
}

mode="${1:-}"
case "$mode" in
  --help|-h)
    usage
    exit 0
    ;;
  --prepare|--publish)
    ;;
  *)
    printf 'Unknown mode: %s\n' "${mode:-<missing>}" >&2
    usage >&2
    exit 2
    ;;
esac

SDK_REPO="${SDK_REPO:-$DEFAULT_SDK_REPO}"
CONNECT_REPO="${CONNECT_REPO:-$DEFAULT_CONNECT_REPO}"
CONNECT_REMOTE_URL="${CONNECT_REMOTE_URL:-$DEFAULT_CONNECT_REMOTE_URL}"
SOURCE_REF="${SOURCE_REF:-$DEFAULT_SOURCE_REF}"
PUBLIC_BRANCH="${PUBLIC_BRANCH:-$DEFAULT_PUBLIC_BRANCH}"

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    printf 'Required command is unavailable: %s\n' "$1" >&2
    exit 1
  }
}

for command_name in git node npm rsync shasum; do
  require_command "$command_name"
done

if [[ "$mode" == '--publish' ]]; then
  require_command gh
fi

git -C "$SDK_REPO" rev-parse --is-inside-work-tree >/dev/null
source_commit="$(git -C "$SDK_REPO" rev-parse --verify "${SOURCE_REF}^{commit}")"
build_parent="$(mktemp -d "${TMPDIR:-/tmp}/commercehub-connect-release.XXXXXX")"
build_worktree="$build_parent/sdk"
worktree_registered=false

cleanup() {
  if [[ "$worktree_registered" == true ]]; then
    git -C "$SDK_REPO" worktree remove --force "$build_worktree" >/dev/null 2>&1 || true
  fi
  rmdir "$build_parent" >/dev/null 2>&1 || true
}
trap cleanup EXIT

git -C "$SDK_REPO" worktree add --detach "$build_worktree" "$source_commit"
worktree_registered=true

(
  cd "$build_worktree"
  npm ci
  npm run build
  npm run pack:dist
  npm run docs
)

version="$(node -p "require('$build_worktree/package.json').version")"
tag="v$version"
artifact_name="commerce-hub-connect-sdk-$version.tgz"
artifact_source="$build_worktree/dist/$artifact_name"
[[ -f "$artifact_source" ]] || {
  printf 'Expected artifact was not generated: %s\n' "$artifact_source" >&2
  exit 1
}

release_output_dir="${RELEASE_OUTPUT_DIR:-$SDK_REPO/exports/releases/$tag}"
prepared_artifact="$release_output_dir/$artifact_name"
mkdir -p "$release_output_dir/docs"
rsync -a --delete "$build_worktree/docs/" "$release_output_dir/docs/"
cp "$artifact_source" "$prepared_artifact"
artifact_sha256="$(shasum -a 256 "$prepared_artifact" | awk '{print $1}')"

node -e '
  const fs = require("node:fs");
  const [path, version, sourceRef, sourceCommit, artifact, sha256] = process.argv.slice(1);
  fs.writeFileSync(path, `${JSON.stringify({version, sourceRef, sourceCommit, artifact, sha256}, null, 2)}\n`);
' "$release_output_dir/build-manifest.json" "$version" "$SOURCE_REF" "$source_commit" "$artifact_name" "$artifact_sha256"
node -e '
  const fs = require("node:fs");
  const [path, sha256, artifact] = process.argv.slice(1);
  fs.writeFileSync(path, `${sha256}  ${artifact}\n`);
' "$prepared_artifact.sha256" "$artifact_sha256" "$artifact_name"

printf 'Prepared %s from %s (%s)\n' "$prepared_artifact" "$SOURCE_REF" "$source_commit"

if [[ "$mode" == '--prepare' ]]; then
  exit 0
fi

if [[ ! -d "$CONNECT_REPO/.git" ]]; then
  mkdir -p "$(dirname "$CONNECT_REPO")"
  git clone "$CONNECT_REMOTE_URL" "$CONNECT_REPO"
fi

git -C "$CONNECT_REPO" rev-parse --is-inside-work-tree >/dev/null
[[ -z "$(git -C "$CONNECT_REPO" status --porcelain)" ]] || {
  printf 'Public repository has local changes: %s\n' "$CONNECT_REPO" >&2
  exit 1
}

git -C "$CONNECT_REPO" fetch origin "$PUBLIC_BRANCH"
if git -C "$CONNECT_REPO" show-ref --verify --quiet "refs/heads/$PUBLIC_BRANCH"; then
  git -C "$CONNECT_REPO" checkout "$PUBLIC_BRANCH"
else
  git -C "$CONNECT_REPO" checkout --track -b "$PUBLIC_BRANCH" "origin/$PUBLIC_BRANCH"
fi
git -C "$CONNECT_REPO" pull --ff-only origin "$PUBLIC_BRANCH"

release_json=''
existing_asset_present=false
if release_json="$(gh release view "$tag" --repo "$GITHUB_REPOSITORY" --json tagName,url,targetCommitish,assets 2>/dev/null)"; then
  existing_digest="$(node -e '
    const release = JSON.parse(process.argv[1]);
    const assetName = process.argv[2];
    const asset = release.assets.find((candidate) => candidate.name === assetName);
    process.stdout.write(asset ? (asset.digest ?? "unknown") : "");
  ' "$release_json" "$artifact_name")"
  if [[ -n "$existing_digest" ]]; then
    existing_asset_present=true
  fi
  if [[ "$existing_asset_present" == true && "$existing_digest" != "sha256:$artifact_sha256" ]]; then
    printf 'Release asset already exists with a different digest; refusing to replace it.\n' >&2
    exit 1
  fi
else
  release_json=''
fi

rsync -a --delete "$release_output_dir/docs/" "$CONNECT_REPO/docs/"
git -C "$CONNECT_REPO" add docs
if ! git -C "$CONNECT_REPO" diff --cached --quiet -- docs; then
  git -C "$CONNECT_REPO" commit -m "$version"
  git -C "$CONNECT_REPO" push origin "$PUBLIC_BRANCH"
fi

if [[ -z "$release_json" ]]; then
  gh release create "$tag" "$prepared_artifact" \
    --repo "$GITHUB_REPOSITORY" \
    --target "$PUBLIC_BRANCH" \
    --title "$tag" \
    --notes "commerce-hub-connect-sdk $version"
elif [[ "$existing_asset_present" == false ]]; then
  gh release upload "$tag" "$prepared_artifact" --repo "$GITHUB_REPOSITORY"
fi

release_json="$(gh release view "$tag" --repo "$GITHUB_REPOSITORY" --json tagName,url,targetCommitish,assets)"
node -e '
  const release = JSON.parse(process.argv[1]);
  const assetName = process.argv[2];
  const expectedDigest = `sha256:${process.argv[3]}`;
  const asset = release.assets.find((candidate) => candidate.name === assetName);
  if (!asset) throw new Error(`Release asset is missing: ${assetName}`);
  if (asset.digest && asset.digest !== expectedDigest) {
    throw new Error(`Release digest mismatch: ${asset.digest} !== ${expectedDigest}`);
  }
  console.log(`Release: ${release.url}`);
  console.log(`SHA-256: ${process.argv[3]}`);
' "$release_json" "$artifact_name" "$artifact_sha256"
```

- [ ] **Step 2: Mark the script executable**

Run: `chmod +x .agents/skills/deploy-commercehub-connect/scripts/release.sh`

Expected: `test -x .agents/skills/deploy-commercehub-connect/scripts/release.sh` exits 0.

- [ ] **Step 3: Run the contract test**

Run: `node --test dev/deploy-commercehub-connect-skill_test.js`

Expected: the mode test passes, while the skill-routing test still fails because `SKILL.md` has not been updated.

- [ ] **Step 4: Commit the script**

```bash
git add .agents/skills/deploy-commercehub-connect/scripts/release.sh
git commit -m "feat: build SDK releases in an isolated worktree"
```

### Task 3: Route the deployment skill through the release command

**Files:**
- Modify: `.agents/skills/deploy-commercehub-connect/SKILL.md`
- Test: `dev/deploy-commercehub-connect-skill_test.js`

- [ ] **Step 1: Replace hard-coded manual release commands**

Update the skill with `Prepare only` and `Publish` sections. The prepare section must run `./.agents/skills/deploy-commercehub-connect/scripts/release.sh --prepare` and explain that it builds committed `feature/wallet-sdk-0.9.10` in a disposable detached worktree, writes artifacts to `exports/releases/v<version>/`, excludes uncommitted SDK changes, and leaves the active checkout unchanged.

The publish section must require explicit user approval before running `./.agents/skills/deploy-commercehub-connect/scripts/release.sh --publish`. It must explain that the mode defaults to `/Users/unnikrishnan.b/Documents/Projects/NorthAm/repo/connect` and `https://github.com/commerce-hub/connect`, refuses a dirty public checkout, publishes generated docs to `main`, and creates or uploads release `v<version>` without replacing an existing asset.

Also document the `SDK_REPO`, `CONNECT_REPO`, `CONNECT_REMOTE_URL`, `SOURCE_REF`, `PUBLIC_BRANCH`, and `RELEASE_OUTPUT_DIR` overrides. Remove every `/Users/neer.patel` path and the active-checkout build commands.

- [ ] **Step 2: Run the contract test**

Run: `node --test dev/deploy-commercehub-connect-skill_test.js`

Expected: 2 tests pass.

- [ ] **Step 3: Run shell syntax and whitespace checks**

Run:

```bash
bash -n .agents/skills/deploy-commercehub-connect/scripts/release.sh
git diff --check
```

Expected: both commands exit 0 with no output.

- [ ] **Step 4: Commit the skill update**

```bash
git add .agents/skills/deploy-commercehub-connect/SKILL.md dev/deploy-commercehub-connect-skill_test.js
git commit -m "docs: route SDK deployment through isolated release"
```

### Task 4: Prove preparation leaves the active checkout unchanged

**Files:**
- Verify: `.agents/skills/deploy-commercehub-connect/scripts/release.sh`
- Verify: `exports/releases/v0.9.10/commerce-hub-connect-sdk-0.9.10.tgz`
- Verify: `exports/releases/v0.9.10/build-manifest.json`

- [ ] **Step 1: Record the active checkout state**

Run:

```bash
git status --porcelain=v1 --untracked-files=all > /tmp/commercehub-connect-status-before
git rev-parse feature/wallet-sdk-0.9.10
```

Expected: the status snapshot is empty after the implementation commits, and Git prints the feature-branch commit SHA.

- [ ] **Step 2: Prepare the release without publishing**

Run:

```bash
env npm_config_cache=/tmp/commercehub-connect-npm-cache \
  ./.agents/skills/deploy-commercehub-connect/scripts/release.sh --prepare
```

Expected: build, packaging, and docs generation succeed; the final line reports the prepared tarball, feature ref, and source SHA. No `connect` repository is cloned and no `gh` command runs.

- [ ] **Step 3: Verify artifact identity and package contents**

Run:

```bash
node -e '
  const manifest = require("./exports/releases/v0.9.10/build-manifest.json");
  if (manifest.version !== "0.9.10") throw new Error("Unexpected version");
  if (manifest.sourceRef !== "feature/wallet-sdk-0.9.10") throw new Error("Unexpected source ref");
  console.log(manifest);
'
shasum -a 256 -c exports/releases/v0.9.10/commerce-hub-connect-sdk-0.9.10.tgz.sha256
tar -tzf exports/releases/v0.9.10/commerce-hub-connect-sdk-0.9.10.tgz | rg 'package/(commerce-hub-connect.js|commerce-hub-connect.d.ts|internal/)'
```

Expected: manifest validation succeeds, checksum reports `OK`, and package entries include the SDK module, declarations, and internal output.

- [ ] **Step 4: Prove active-checkout isolation**

Run:

```bash
git status --porcelain=v1 --untracked-files=all > /tmp/commercehub-connect-status-after
diff -u /tmp/commercehub-connect-status-before /tmp/commercehub-connect-status-after
git worktree list
```

Expected: `diff` exits 0 with no output and no temporary release worktree remains registered.

- [ ] **Step 5: Run all non-browser verification**

Run:

```bash
npm run build
npm run lint
env npm_config_cache=/tmp/commercehub-connect-npm-cache node --test dev/*_test.js
git diff --check origin/feature/wallet-sdk-0.9.10..HEAD
```

Expected: build passes; lint has 0 errors (the two existing JSONForms warnings may remain); all Node tests pass; the committed diff has no whitespace errors.

- [ ] **Step 6: Keep the prepared release local**

Do not run `--publish`. Report the artifact path, checksum, source commit, active-checkout isolation result, and that external publication remains pending explicit approval.
