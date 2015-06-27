#!/bin/bash

babel parser.js compiler.js export.js > tempart.es5.js

exit $?
