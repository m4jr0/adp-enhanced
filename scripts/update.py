#!/usr/bin/python

import argparse
import in_place
import os
import re
import sys

from git import Repo
from urllib.error import URLError
from urllib.request import urlopen

__author__ = "m4jr0"
__copyright__ = "m4jr0"
__credits__ = ["m4jr0"]
__license__ = "MIT"
__version__ = "0.1"
__maintainer__ = "m4jr0"


class AdpEnhancedUpdater:
    VERSION_LABEL_BETA = "beta"
    VERSION_LABEL_RELEASE = "release"

    VERSION_BRANCH_DEV = "master"
    VERSION_BRANCH_BETA = "beta"
    VERSION_BRANCH_RELEASE = "release"

    UPDATE_SCRIPT_PATH = os.path.dirname(os.path.abspath(__file__))

    ADP_SCRIPT_PATH = "{script_path}/../src/adp_enhanced.user.js".format(
        script_path=UPDATE_SCRIPT_PATH,
    )

    REPO_PATH = "{script_path}/..".format(
        script_path=UPDATE_SCRIPT_PATH,
    )

    ADP_SCRIPT_VERSION_REGEX = re.compile(
        ".*@version\s+([0-9]+(\.[0-9]+)+)", re.IGNORECASE
    )

    ADP_DOWNLOAD_URL_REGEX = re.compile(
        ".*@downloadURL\s+https://raw.githubusercontent.com/m4jr0/adp-enhanced/.+?/src/adp_enhanced.user.js",
        re.IGNORECASE,
    )

    ADP_UPDATE_URL_REGEX = re.compile(
        ".*@updateURL\s+https://raw.githubusercontent.com/m4jr0/adp-enhanced/.+?/src/adp_enhanced.user.js",
        re.IGNORECASE,
    )

    BETA_VERSION_REGEX = re.compile("^[0-9]+(?:\.[0-9]+){2}", re.IGNORECASE)
    RELEASE_VERSION_REGEX = re.compile("^[0-9]+\.[0-9]+", re.IGNORECASE)
    VERSION_REGEX = re.compile("^[0-9]+(\.[0-9]+)+$", re.IGNORECASE)

    @classmethod
    def update(cls, build, version=None, is_silent=False):
        repo = Repo(cls.REPO_PATH)
        git_diff_obj = repo.index.diff(None)

        if git_diff_obj:
            raise Exception("You have unstaged changes. Aborting.")

        git_diff_obj = repo.index.diff("HEAD")

        if git_diff_obj:
            raise Exception("You have staged changes. Aborting.")

        if repo.active_branch.name != cls.VERSION_BRANCH_DEV:
            raise Exception(
                "The current branch is not {required_branch}. Aborting.".format(
                    required_branch=cls.VERSION_BRANCH_DEV,
                )
            )

        repo.remotes.origin.fetch()
        commits_behind = repo.iter_commits("master..origin/master")

        for commit in commits_behind:
            raise Exception("You have commits behind. Aborting.")

        commits_ahead = repo.iter_commits("origin/master..master")

        for commit in commits_ahead:
            raise Exception("You have commits ahead. Aborting.")

        if build == cls.VERSION_LABEL_BETA:
            target_branch = cls.VERSION_BRANCH_BETA
        elif build == cls.VERSION_LABEL_RELEASE:
            target_branch = cls.VERSION_BRANCH_RELEASE
        else:
            raise Exception(
                "Invalid build: {build}".format(
                    build=build,
                )
            )

        if version is None:
            with open(cls.ADP_SCRIPT_PATH) as file:
                line = file.readline()

                while line and version is None:
                    line = file.readline()

                    if line is not None:
                        match = cls.ADP_SCRIPT_VERSION_REGEX.match(line)

                        if match is not None:
                            version = match[1]

            if version is None:
                raise Exception(
                    "Unable to find the build in {path}".format(
                        path=cls.ADP_SCRIPT_PATH,
                    )
                )

            version = cls.__get_build_version(build, version)

        if version is None or cls.VERSION_REGEX.match(version) is None:
            raise Exception(
                "Invalid version: {version}".format(
                    version=version,
                )
            )

        target_url = "https://raw.githubusercontent.com/m4jr0/adp-enhanced/{branch}/src/adp_enhanced.user.js".format(
            branch=target_branch,
        )

        current_version = None

        try:
            current_script = urlopen(target_url)

            for line in current_script:
                match = cls.ADP_SCRIPT_VERSION_REGEX.match(line.decode("utf-8"))

                if match is not None:
                    current_version = match[1]
                    break

        except URLError:
            pass

        if current_version is None:
            current_version = "[no previous version] (is GitHub down?)"

        print(
            "The update is set to upgrade to {version} from {current_version}.".format(
                version=version,
                current_version=current_version,
            )
        )

        if not is_silent and not cls.__ask_confirmation("Continue?"):
            return

        try:
            target_head = repo.heads[target_branch]
        except IndexError:
            target_head = None

        if target_head is not None:
            if not is_silent and not cls.__ask_confirmation(
                "Local branch {branch} will be deleted. Continue?".format(
                    branch=target_branch,
                )
            ):
                return

            print(
                "Deleting local branch {branch}...".format(
                    branch=target_branch,
                )
            )

            repo.delete_head(
                target_branch,
                force=True,
            )

        repo.create_head(target_branch, repo.refs[cls.VERSION_BRANCH_DEV])
        repo.heads[target_branch].checkout()
        print("Updating script file...")

        with in_place.InPlace(cls.ADP_SCRIPT_PATH) as file:
            is_version_updated = False
            is_download_url_updated = False
            is_update_url_updated = False

            for line in file:
                if not is_version_updated:
                    match = cls.ADP_SCRIPT_VERSION_REGEX.match(line)

                    if match is not None:
                        print("Replacing version...")

                        line = "// @version      {version}\n".format(
                            version=version,
                        )

                        is_version_updated = True

                if not is_download_url_updated:
                    match = cls.ADP_DOWNLOAD_URL_REGEX.match(line)

                    if match is not None:
                        print("Replacing download URL...")

                        line = "// @downloadURL  {url}\n".format(
                            url=target_url,
                        )

                        is_download_url_updated = True

                if not is_update_url_updated:
                    match = cls.ADP_UPDATE_URL_REGEX.match(line)

                    if match is not None:
                        print("Replacing update URL...")

                        line = "// @updateURL    {url}\n".format(
                            url=target_url,
                        )

                        is_update_url_updated = True

                file.write(line)

        repo.git.add(update=True)

        repo.index.commit(
            "Update {build} build to version {version}".format(
                build=build,
                version=version,
            )
        )

        repo.git.push("--set-upstream", "origin", target_branch, force=True)
        repo.git.push(force=True)
        repo.heads[cls.VERSION_BRANCH_DEV].checkout()

        print(
            "Deleting local branch {branch}...".format(
                branch=target_branch,
            )
        )

        repo.delete_head(
            target_branch,
            force=True,
        )

        print("Done!")

    @classmethod
    def __get_build_version(cls, build, version):
        if build == cls.VERSION_LABEL_BETA:
            return cls.BETA_VERSION_REGEX.match(version)[0]
        elif build == cls.VERSION_LABEL_RELEASE:
            return cls.RELEASE_VERSION_REGEX.match(version)[0]

        raise Exception(
            "Unknown build: {build}".format(
                build=build,
            )
        )

    @classmethod
    def __ask_confirmation(cls, question):
        reply = (
            str(
                input(
                    "{question} (y/n): ".format(
                        question=question,
                    )
                )
            )
            .lower()
            .strip()
        )

        if reply in [
            "y",
            "yes",
            "yeah",
        ]:
            return True
        elif reply in [
            "n",
            "no",
            "nope",
            "nope.avi",
        ]:
            return False

        return cls.__ask_confirmation(question)


def main():
    try:
        parser = argparse.ArgumentParser(description="Update ADP Enhanced")

        parser.add_argument(
            "-b",
            "--build",
            help="specify the build to update",
            choices=[
                AdpEnhancedUpdater.VERSION_LABEL_BETA,
                AdpEnhancedUpdater.VERSION_LABEL_RELEASE,
            ],
            required=True,
        )

        parser.add_argument(
            "-v",
            "--version",
            help="specify the version to set (optional)",
            required=False,
        )

        parser.add_argument(
            "-s",
            "--silent",
            help="whether to bypass confirmations or not (optional)",
            action="store_true",
            required=False,
        )

        args = parser.parse_args()
        AdpEnhancedUpdater.update(args.build, args.version, args.silent)

    except KeyboardInterrupt as error:
        print("\nAborting.")

    except Exception as error:
        print(
            "An error occurred: {error}\nAborting.".format(
                error=error,
            )
        )

        sys.exit(1)

    sys.exit(0)


if __name__ == "__main__":
    main()
