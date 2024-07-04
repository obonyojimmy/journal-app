#!/bin/bash

##set -euo pipefail

# TODO:  Add wait for db postgres connection 
sleep 5

## run db migrations
alembic upgrade head

## start dev api. (TODO: Update to run via gunicorn for concurent api requests)
uvicorn src.main:app --reload --host 0.0.0.0 --port 5000