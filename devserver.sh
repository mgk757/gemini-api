#!/bin/sh
PORT=3001
source .venv/bin/activate
python -m flask --app main run -p $PORT --debug