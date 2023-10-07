#!/bin/bash

# Assign the nginx configuration filename
nginx_conf="/etc/nginx/conf.d/default.conf"

# Recreate runtime-env config file
rm -rf ./runtime-env.js && touch ./runtime-env.js

echo "window._env_ = {" >> ./runtime-env.js

# Read each line in .env file, each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")

  # Otherwise use value from .env file
  [[ -z $value ]] && value=${varvalue}
  
  # Append configuration property to JS file
  echo "  $varname: \"$value\"," >> ./runtime-env.js

  # Replace the nginx environment variable placeholder
  if [[ $varname != "" && $value != "" ]]; then
    sed -i 's|{'$varname'}|'"$value"'|g' $nginx_conf
  fi

done < .env

echo "}" >> ./runtime-env.js