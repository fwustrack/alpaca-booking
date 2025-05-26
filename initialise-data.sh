#!/bin/bash

./runmanage.sh migrate
./runmanage.sh createsuperuser --noinput
./runmanage.sh loaddata base-data groups --ignore-existing
./runmanage.sh initialize-test-data

./runmanage.sh set-default-password laura
./runmanage.sh set-default-password felix
