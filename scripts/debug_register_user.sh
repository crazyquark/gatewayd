#!/bin/bash
node --debug=9090 --debug-brk ../bin/gateway register_user pam@m.com password rNekFtA851HnwBe25wcJ5WksXY9MsuJGUB &
node-inspector --debug-port=9090

