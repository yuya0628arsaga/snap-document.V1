#!/bin/sh
set -e

echo "$OS_NAME"
if [ "$OS_NAME" = "Linux" ]; then
    useradd -u "$USER_ID" "$USER_NAME" && echo "Add user $USER_NAME($USER_ID)"
    groupadd -g "$GROUP_ID" "$GROUP_NAME" && echo "Add group $GROUP_NAME($GROUP_ID)"
    gpasswd -a "$USER_NAME" "$GROUP_NAME" && echo "Assign $USER_NAME to $GROUP_NAME"
    mkdir "/home/$USER_NAME" || echo "/home/$USER_NAME is all ready exists." && chown -R "$USER_NAME:$GROUP_NAME" "/home/$USER_NAME"
fi
whoami


# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
	set -- php "$@"
fi

exec "$@"
