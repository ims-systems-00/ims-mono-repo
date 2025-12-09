# Contribution guidelines

### Development, Staging and Production branches

Our `v2.x/staging`, `v2,.x/development` and `v2.x/production` branches are the three main branches through which codes are tested and pushed through live `environment`. Any contribution needs to follow a proper `git-flow` to integrate your codes to these branches for testing and deployments.

### Feature branch

Any **feature-branch** needs to be created from **v2.x/staging**. Once stable codes are ready, create a pull request to test your codes in our `v2.x/development` branch where we manage our testing servers. **feature-branchs** needs to be prefixed with `feat`. Example: `feat/test-editor`, `feat/email-templating` etc.

```

```

If your codes work and pass the **tests**, you also need to push your codes to `v2.x/staging` at the same time through a pull request for final checks and deployment preparations.

> CAUTION: Never pull any code in your **feature-branch** from `v2.x/development`. You can only pull codes from **v2.x/staging** `environment` or `brnach` we should say. Whenever new stable codes are published here and keep your branches in sync with **v2.x/staging**. Bear in mind
> **v2.x/staging** is almost like a replica of **v2.x/production**. Only stble codes are lying there.

After all testing are done features will be merged into `v2.x/production` and the branch will be deleted.

### HotFix branch

A **hotfix-branch** is always created to provide resolutions on **P1 Incidents** or **Bug reports**. Checkout a new branch from `v2.x/production` with a prefix `hot-fix`. Fix your code in isolation here. For testing provide your codes through PR:

1. Send your codes to `v2.x/development`.
2. If step `1` passes send your code to `v2.x/staging`.

Your branch will be merged to `v2.x/production` after ensuring proper `QA`.

```

```

After your branch is merged into `v2.x/production` branch will be deleted from repository.

> CAUTION: Never pull any code in your **hotfix-branch** from any branch.

### Release branch

Release branches are created to send stable codes to `v2.x/production` and these are prefixed with `release`. We create them for `tagging`, `minor bug fixing` and `deployment` preparations and
`documentation` purposes.

> CAUTION: Never pull any code in a **release-branch** from any branch.

### Important Notes

> Any **pull-request** in this repository requires atleast one person to `review` manually before they can be merged to the **target branch**.
