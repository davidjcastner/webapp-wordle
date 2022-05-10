'''
deploys the application to github pages

assumes that the application has already been built,
and bundle is in the build directory
'''

import json
import os
import shutil

DEPLOY_DIR = 'deploy'
BUILD_DIR = 'build'


def remove_all_files(directory: str, skip: set = set()) -> None:
    '''removes all files and directories in given directory,
    except those in the skip set'''
    for f in os.listdir(directory):
        if f in skip:
            continue
        path = os.path.join(directory, f)
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.remove(path)


def main() -> None:
    # get the current directory and check if its correct
    cwd = os.getcwd()
    package_info = os.path.join(cwd, 'package.json')
    package_info = json.load(open(package_info))
    assert package_info['name'] == 'webapp-wordle'

    # create the deploy directory if it doesn't exist
    print('creating deploy directory')
    if not os.path.exists(DEPLOY_DIR):
        os.mkdir(DEPLOY_DIR)

    # clean the deploy directory
    print('cleaning deploy directory')
    remove_all_files(DEPLOY_DIR)

    # clone the latest version of the app into the deploy directory
    print('cloning latest version of the app')
    deploy_repo = 'https://github.com/davidjcastner/webapp-wordle.git'
    deploy_branch = 'gh-pages'
    command = f'git clone -b {deploy_branch} {deploy_repo} {DEPLOY_DIR}'
    os.system(command)

    # remove non git files from the deploy directory
    print('removing non git files')
    remove_all_files(DEPLOY_DIR, skip={'.git'})

    # copy all files in the dist directory to the deploy directory
    print('copying files to deploy directory')
    for f in os.listdir(BUILD_DIR):
        src = os.path.join(BUILD_DIR, f)
        dst = os.path.join(DEPLOY_DIR, f)
        shutil.copy(src, dst)

    # check if there are any changes to the deploy directory
    print('checking for changes')
    command = f'git status --porcelain {DEPLOY_DIR}'
    output = os.popen(command).read()
    if not output:
        print('no changes')
        return

    # get the commit id and branch name from this git repo
    # to be used in the commit message
    print('getting commit id and branch name')
    command = 'git rev-parse --abbrev-ref HEAD'
    branch = os.popen(command).read().strip()
    command = 'git rev-parse HEAD'
    commit = os.popen(command).read().strip()

    # commit the changes
    print('committing changes')
    command = f'git add {DEPLOY_DIR}'
    os.system(command)
    command = f'git commit -m "deploy branch=<{branch}> commit=<{commit}>"'
    os.system(command)

    # push the changes
    print('pushing changes')
    command = f'git push origin {deploy_branch}'
    os.system(command)


if __name__ == '__main__':
    main()
