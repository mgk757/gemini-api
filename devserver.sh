#!/bin/sh
PORT=8080
python -m flask --app main run -p $PORT --debug