---
name: deploy-commercehub-connect
description: Use when releasing the CommerceHub Connect Wallet SDK from this repo, including versioned builds, npm tarball packaging, generated docs publishing to the sibling commerce-hub/connect repo, or GitHub release asset uploads.
---

# Deploy CommerceHub Connect

## Overview

Release the SDK from `/Users/neer.patel/Documents/repos/commercehub-connect-wallet-sdk` and publish public docs/assets through `/Users/neer.patel/Documents/repos/connect`. Treat `package.json` as the source of truth for the version and `commerce-hub/connect` as the explicit GitHub target.

## Workflow

1. Inspect state before changing anything:

```bash
node -p "require('./package.json').version"
git status --short
git -C /Users/neer.patel/Documents/repos/connect status --short
```

Stop if the target `connect` repo has unrelated local edits. Do not remove unrelated untracked files in either repo.

2. Build, package, and regenerate docs from the SDK repo:

```bash
npm run build
npm run pack:dist
npm run docs
```

Confirm the tarball exists at `dist/commerce-hub-connect-sdk-<version>.tgz`.

3. Publish docs to the public repo:

```bash
rsync -a --delete docs/ /Users/neer.patel/Documents/repos/connect/docs/
git -C /Users/neer.patel/Documents/repos/connect diff --stat -- docs
git -C /Users/neer.patel/Documents/repos/connect add docs
git -C /Users/neer.patel/Documents/repos/connect commit -m "<version>"
git -C /Users/neer.patel/Documents/repos/connect push origin main
git -C /Users/neer.patel/Documents/repos/connect ls-remote origin refs/heads/main
```

Use the raw package version as the commit message unless the user gives a different message.

4. Create or update the GitHub release with the tarball:

```bash
gh release view "v<version>" --repo commerce-hub/connect --json tagName,url,assets
```

If the release is missing:

```bash
gh release create "v<version>" "dist/commerce-hub-connect-sdk-<version>.tgz" \
  --repo commerce-hub/connect \
  --target main \
  --title "v<version>" \
  --notes "commerce-hub-connect-sdk <version>"
```

If the release exists but the asset is absent:

```bash
gh release upload "v<version>" "dist/commerce-hub-connect-sdk-<version>.tgz" \
  --repo commerce-hub/connect
```

Do not use `--clobber` unless the user explicitly asks to replace an existing uploaded asset.

5. Verify the release asset:

```bash
gh release view "v<version>" --repo commerce-hub/connect --json tagName,url,targetCommitish,assets
shasum -a 256 "dist/commerce-hub-connect-sdk-<version>.tgz"
```

Confirm the asset name, `state: uploaded`, size, and GitHub `digest` match the local SHA-256. Report the release URL and digest.

## Guardrails

- Always pass `--repo commerce-hub/connect` to `gh`; this SDK checkout may not have a GitHub remote.
- Use `v<version>` for release tags and `<version>` for docs commits unless told otherwise.
- Use `rsync -a --delete` for docs so removed generated files do not linger.
- Verify `gh release view` after upload or create; an upload command alone is not proof.
- Keep SDK version changes, package-lock metadata, docs output, public docs repo commits, and release assets coherent when the user asks for a full deployment.
