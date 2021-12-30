#!/usr/bin/env bash
bump=$1

valid_bumps=(major minor patch)

if [[ ! " ${valid_bumps[*]} " =~ " ${1} " ]]; then
	echo 'No version bump specified. Call either:'
	echo '$ ./release.sh major'
	echo '$ ./release.sh minor'
	echo '$ ./release.sh patch'
	exit 1
fi

# Check, if we are on 'main' branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ $current_branch != 'main' ]]; then
	echo "Please switch to main branch before releasing a new version!"
	exit 1
fi

echo
echo "=============="
echo "Pulling branch"
echo "=============="
git pull
if [[ $? > 0 ]]; then exit 1; fi

# Check, if there are uncommited changes
git_status=$(git status)
if [[ $? > 0 ]]; then exit 1; fi
if [[ $git_status != *"nothing to commit, working tree clean"* ]]; then
	echo
	echo "You seem to have uncommited changes. Please commit them before releasing a new version!"
	exit 1
fi

echo
echo "============="
echo "Checking lint"
echo "============="
yarn lint
if [[ $? > 0 ]]; then exit 1; fi

echo
echo "============"
echo "Pulling tags"
echo "============"
git pull --tags
if [[ $? > 0 ]]; then exit 1; fi

echo
echo "===================="
echo "Getting last version"
echo "===================="
last_tag=$(git describe --tags --abbrev=0)
if [[ $? > 0 ]]; then exit 1; fi
old_version=${last_tag:1}
echo $old_version

echo
echo "======================="
echo "Calculating new version"
echo "======================="
IFS='.' read -r -a version_array <<< "$old_version"
if [[ $bump == 'major' ]]; then
	version_array[0]=$((version_array[0] + 1))
	version_array[1]=0
	version_array[2]=0
elif [[ $bump == 'minor' ]]; then
	version_array[0]=${version_array[0]}
	version_array[1]=$((version_array[1] + 1))
	version_array[2]=0
elif [[ $bump == 'patch' ]]; then
	version_array[0]=${version_array[0]}
	version_array[1]=${version_array[1]}
	version_array[2]=$((version_array[2] + 1))
fi
new_version=${version_array[0]}.${version_array[1]}.${version_array[2]}
echo $new_version

echo
echo "========="
echo "Changelog"
echo "========="
changelog=$(git log --pretty="- %s (%h)" v${old_version}...)
if [[ $? > 0 ]]; then exit 1; fi
echo "$changelog"

echo
read -p "Do you want to release this version? (y/n)" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then

	echo
	echo "=========================="
	echo "Prepending to CHANGELOG.md"
	echo "=========================="
	changelog_header="# Release Notes"
	printf -v date '%(%Y-%m-%d)T' -1
	sed -i "s/${changelog_header}//" CHANGELOG.md
	new_changelog=$changelog_header
	new_changelog+=$'\n\n'
	new_changelog+="## [v${new_version} (${date})](https://github.com/webflorist/privacy-policy-text/compare/v${old_version}...v${new_version})"
	new_changelog+=$'\n\n'
	new_changelog+=$changelog
	new_changelog+=$(cat CHANGELOG.md)
	echo "$new_changelog" > CHANGELOG.md

	echo
	echo "==============================="
	echo "Bumping version in package.json"
	echo "==============================="
	file_content=$(cat package.json)
	search="\"version\": \"${old_version}\""
	replace="\"version\": \"${new_version}\""
	echo $search
	echo $replace
	if [[ $file_content != *$search* ]]; then
		echo
		echo "$search not found in package.json."
		exit 1
	fi
	sed -i "s/$search/$replace/" package.json
	if [[ $? > 0 ]]; then exit 1; fi

	echo
	echo "=================="
	echo "Committing changes"
	echo "=================="
	git commit -a -m "RELEASE ${new_version}"
	if [[ $? > 0 ]]; then exit 1; fi

	echo
	echo "=============="
	echo "Pushing branch"
	echo "=============="
	git push
	if [[ $? > 0 ]]; then exit 1; fi

	echo
	echo "============"
	echo "Creating and pushing tag"
	echo "============"
	git tag -a v${new_version} -m "v${new_version}"
	if [[ $? > 0 ]]; then exit 1; fi
	git push --tags
	if [[ $? > 0 ]]; then exit 1; fi

fi
