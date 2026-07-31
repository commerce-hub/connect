# Isolated local release design

## Goal

Prepare and optionally publish the CommerceHub Connect Wallet SDK from this machine without modifying the active SDK checkout or interfering with local development. For the current release, all artifacts must come from the committed `feature/wallet-sdk-0.9.10` branch.

## Scope

The deployment skill will gain a reusable release script with two explicit modes:

- `--prepare` builds and retains local release artifacts without changing an external repository or GitHub release.
- `--publish` performs the same isolated build and then publishes documentation and the package artifact.

Implementation verification will exercise only `--prepare`. Publishing requires a separate explicit invocation.

## Paths and configuration

Defaults are specific to the current machine but remain overridable through environment variables:

- SDK repository: `/Users/unnikrishnan.b/Documents/Projects/NorthAm/repo/commercehub-connect-wallet-sdk`
- Public repository: `/Users/unnikrishnan.b/Documents/Projects/NorthAm/repo/connect`
- Public remote: `https://github.com/commerce-hub/connect`
- Source ref: `feature/wallet-sdk-0.9.10`
- Public branch: `main`
- Local output: `<sdk-repository>/exports/releases/v<package-version>`

The package version continues to come from `package.json`. The script does not change SDK versions.

## Isolated build flow

1. Resolve the configured source ref to a commit and record its SHA.
2. Create a temporary detached Git worktree for that exact commit under the system temporary directory.
3. Run `npm ci`, `npm run build`, `npm run pack:dist`, and `npm run docs` only inside the temporary worktree.
4. Confirm the expected versioned tarball exists.
5. Copy the tarball, generated documentation, checksum, and a small build manifest into the ignored release-output directory.
6. Remove the temporary Git worktree on success or failure.

Because the build starts from a committed ref, local uncommitted changes are neither modified nor included. Generated root files, `dist/`, documentation cleanup, dependency installation, and other build side effects remain confined to the temporary worktree.

## Publish flow

When `--publish` is explicitly selected:

1. Use the configured public checkout, cloning `https://github.com/commerce-hub/connect` there if it does not exist.
2. Refuse to continue if the public checkout has local changes.
3. Update its `main` branch using a fast-forward-only pull.
4. Synchronize the generated documentation into its `docs/` directory.
5. Commit documentation changes using the raw package version and push `main`. If documentation is unchanged, skip the commit while retaining the existing commit.
6. Inspect release `v<version>` in `commerce-hub/connect`.
7. Create the release with the tarball when absent, or upload the tarball when the release exists without that asset.
8. Refuse to replace an existing release asset automatically.
9. Verify the remote release metadata and report the local SHA-256 digest.

Every GitHub CLI release operation must specify `--repo commerce-hub/connect`.

## Failure handling and guardrails

- Reject unknown modes and missing required tools.
- Refuse publication from a source ref that cannot be resolved.
- Refuse publication when the public checkout is dirty or cannot be updated by fast-forward.
- Never delete or overwrite unrelated SDK or public-repository files.
- Never replace an existing GitHub release asset unless the workflow is deliberately extended after explicit approval.
- Use a cleanup trap so failed builds do not leave registered worktrees.
- Retain prepared artifacts outside the temporary worktree for inspection and manual use.

## Verification

Verification will include:

- shell syntax checking;
- a successful `--prepare` run from `feature/wallet-sdk-0.9.10`;
- confirmation that the artifact version and manifest source SHA match the feature branch;
- tarball content inspection and SHA-256 generation;
- before/after SDK Git status comparison proving that preparation did not modify tracked or untracked local-development state;
- no invocation of the public-repository push or GitHub release paths.
