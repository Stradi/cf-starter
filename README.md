# Cloudflare Worker Starter

An opinionated starter project for Cloudflare Workers.

## How to use

Just clone the repo and run `scripts/update-name.sh <new-name>` to update the project name. Then run `pnpm install` in the root directory and you're good to go.

## How to be in sync with the latest changes

You should first add the upstream remote if you haven't already:

```bash
git remote add upstream https://github.com/Stradi/cf-starter.git
```

Then, you can pull the latest changes from the upstream repo:

```bash
git fetch upstream
git merge upstream/main
```

This will ensure that your local branch is up to date with the latest changes from the upstream repo.
