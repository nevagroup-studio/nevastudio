GitHub Releases auto-update flow for NEVA Studio

Requirements

- A GitHub repository to host releases.
- Environment variables:
  - `GH_OWNER`: GitHub owner or organization
  - `GH_REPO`: GitHub repository name
  - `GITHUB_TOKEN` or `GH_TOKEN`: token with release upload permission

How it works

- The installed Windows app must come from the `NSIS` installer build.
- On app startup, `electron-updater` checks GitHub Releases automatically.
- If a newer version exists, it downloads in the background.
- The in-app `Update` button can also trigger a check manually.
- When the update is fully downloaded, clicking `Update` installs it and restarts the app.

Release workflow

1. Increase the `version` in `package.json`.
2. Set the GitHub environment variables.
3. Run `npm run release:github`.
4. Electron Builder uploads the installer and update metadata to GitHub Releases.
5. Existing installed clients detect the new version automatically.

Notes

- Portable builds are kept for convenience, but they are not the path for seamless auto-update.
- If GitHub Releases are private, update auth becomes more complex and should be handled separately.
