#!/bin/bash

set -x

# Wait for service contianers to start
#    -> An improvement could be listening to the service container's TCP port
if [ "$CI" = "true" ];
then
    sleep 5
fi

echo "$1"

test_web_client() {
    ./node_modules/.bin/jasmine "web_client/spec/*.spec.js"
}

test_parse_server() {
    # Credentials for Javascript SDK
    export APP_ID=yourappid
    export SERVER_URL=http://localhost:1337/parse
    export JAVASCRIPT_KEY=javascriptKey
    # Run tests
    ./node_modules/.bin/jasmine "parse_server/spec/*.spec.js"
}

if [ "$1" = "parse_server" ];
then
    test_parse_server
elif [ "$1" = "web_client" ];
then
    test_web_client
else
    test_parse_server
    # We need to seed mongo with schema here or jasmine BeforeAll
    test_web_client
fi
