#!/usr/bin/env bash

# bash strict settings
set -o errexit # exit on errors
set -o nounset # exit on use of uninitialized variable
set -o pipefail

red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`
reset=`tput sgr0`

ACTION="${1-}"

# The server spawns new processes on re-compile, so we can't use a PID based approach.
isRunning() {
  set +e # grep exits with error if no match
  local PROC_COUNT=$(ps aux | grep react-scripts | grep node | wc -l)
  set -e
  if (( $PROC_COUNT == 0 )); then
    return 1
  else
    return 0
  fi
}

case "$ACTION" in
  name)
    echo "react-dev-server";;
  status)
    if isRunning; then
      echo "${green}running${reset}"
    else
      echo "${yellow}not running${reset}"
    fi;;
  start)
    if ! isRunning; then
      bash -c "cd ${BASE_DIR}; cd ${CAT_SCRIPT_CORE_UI_WEB_APP_DIR}; npx react-scripts start > '${SERV_LOG}' 2> '${SERV_ERR}' &"
    else
      # TODO: use echoerr
      echo "${PROCESS_NAME} appears to already be running."
    fi;;
  stop)
    if isRunning; then
      kill $(ps aux | grep react-scripts | grep node | awk '{print $2}')
    else
      # TODO: use echoerr
      echo "${PROCESS_NAME} does not appear to be running."
    fi;;
  restart)
    echo "TODO: restart";;
  *)
    # TODO: library-ize and use 'echoerrandexit'
    echo "Unknown action '${ACTION}'." >&2
    exit 1;;
esac
