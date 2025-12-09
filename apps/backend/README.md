# Contribution guidelines

### Development and Production branches

Our `development` and `production` branches are the two main branches through which codes are tested and pushed through live `environment`. Any contribution needs to follow a proper `git-flow` to integrate your codes to these branches for testing and deployments.

### Feature branch

Any **feature-branch** needs to be created from **production**. Once stable codes are ready, create a pull request to test your codes in our `development` branch where we manage our testing servers. **feature-branchs** needs to be prefixed with `feat`. Example: `feat/test-editor`, `feat/email-templating` etc.

```sh
> git checkout production
> git checkout -b feat/email-templating
```

If your codes work and pass the **tests**, you also need to push your codes to `production` at the same time through a pull request for final checks and deployment preparations.

> CAUTION: Never pull any code in your **feature-branch** from `development`. You can only pull codes from **production** `environment` or `brnach` we should say. Whenever new stable codes are published here and keep your branches in sync with **production**. Bear in mind **development** is almost like a replica of **production**. Only stable codes from different feature branches are lying there to test the integration.

After all testing are done features will be merged into `release` and the `feature` branch will be deleted.

### HotFix branch

A **hotfix-branch** is always created to provide resolutions on **P1 Incidents** or **Bug reports**. Checkout a new branch from `production` with a prefix `hot-fix`. Fix your code in isolation here. 

```sh
> git checkout production
> git checkout -b hot-fix/validation-rules
```

For testing provide your codes through **PR**:

1. Send your codes to `development`.
2. If step `1` passes send your code to `production`.

Your branch will be merged to `release` after ensuring proper `QA`.

After your `hot-fix` branch is merged into `release`, the `hot-fix` will be deleted from repository.

> CAUTION: Never pull any code in your **hotfix-branch** from branchs other than `production`.

### Release branch

Release branches are created to send stable codes to `live-servers` and these are prefixed with `release`. We create them for `tagging`, `minor bug fixing` and `deployment` preparations and
`documentation` purposes.

> CAUTION: Never pull any code in a **release-branch** from branchs other than `production`.

### Important Notes

> Any **pull-request** in this repository requires atleast one person to `review` manually before they can be merged to the **target branch**.
--------------------------
Libra stable install



branch-defaults:
  v4.x/development:
    environment: ims-systems-api-dev
  v4.x/production:
    environment: ims-systems-api-prod
    group_suffix: null
environment-defaults:
  imssystems-api-prod:
    branch: null
    repository: null
global:
  application_name: ims-systems
  default_ec2_keyname: ims-systems
  default_platform: Node.js 20 running on 64bit Amazon Linux 2023
  default_region: eu-west-2
  include_git_submodules: true
  instance_profile: null
  platform_name: null
  platform_version: null
  profile: ims-super-admin
  sc: git
  workspace_type: Application
option_settings:
  aws:autoscaling:launchconfiguration:
    DisableIMDSv1: false
    MonitoringInterval: 1 minute




packages:
  yum:
    libXinerama.x86_64: []
    cups-libs: []
    dbus-glib: []
    libxslt: []
commands:
  01-download-libreoffice:
    command: wget https://tdf.mirror.liquidtelecom.com/libreoffice/stable/24.2.6/rpm/x86_64/LibreOffice_24.2.6_Linux_x86-64_rpm.tar.gz
    cwd: /tmp
    test: "[ ! -f /tmp/LibreOffice_24.2.6_Linux_x86-64_rpm.tar.gz ]"
  02-untar:
    command: sudo tar -xvf LibreOffice_24.2.6_Linux_x86-64_rpm.tar.gz
    cwd: /tmp
    test: "[ ! -d /tmp/LibreOffice_24.2.6_Linux_x86-64_rpm ]"
  03-install:
    command: sudo yum localinstall *.rpm -y
    cwd: /tmp/LibreOffice_24.2.6.2_Linux_x86-64_rpm/RPMS
  04-link-libreoffice:
    command: sudo ln -sf /opt/libreoffice24.2/program/soffice /usr/bin/libreoffice
    test: "[ ! -f /usr/bin/libreoffice ]"
  05-verify:
    command: libreoffice --version