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

case "$ACTION" in
  status)
    set +e # grep exits with error if no match
    PROC_COUNT=$(ps aux | grep react-scripts | grep node | wc -l)
    set -e
    if (( $PROC_COUNT == 0 )); then
      echo "${yellow}not running${reset}"
    else
      echo "${green}running${reset}"
    fi;;
  start)
    SERV_OUT_BASE="${_CATALYST_ENV_LOGS}/${SERV_IFACE}"
    SERV_LOG="${SERV_OUT_BASE}.log"
    SERV_ERR="${SERV_OUT_BASE}.err"
    bash -c "cd ${BASE_DIR}; cd ${CAT_SCRIPT_CORE_UI_WEB_APP_DIR}; npx react-scripts start > "${SERV_LOG}" 2> "${SERV_ERR}" &";;
  stop)
    kill $(ps aux | grep react-scripts | grep node | awk '{print $2}');;
  restart)
    echo "TODO: restart";;
  *)
    # TODO: library-ize and use 'echoerrandexit'
    echo "Unknown action '${ACTION}'." >&2
    exit 1;;
esac
