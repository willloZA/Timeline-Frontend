#!/bin/bash

sed -i "s/import { Observable } from 'rxjs\/Observable'/import { Observable } from 'rxjs'/" node_modules/ngx-sails/sails-client/sails-client.service.d.ts
echo "node_modules/ngx-sails/sails-client/sails-client.service.d.ts: Observable import updated"

sed -i "s/import { Subject } from 'rxjs\/Subject'/import { Subject } from 'rxjs'/" node_modules/ngx-sails/sails-client/sails-request.d.ts
echo "node_modules/ngx-sails/sails-client/sails-request.d.ts: Subject import updated"

sed -i "s/import { Observable } from 'rxjs\/Observable'/import { Observable } from 'rxjs'/" node_modules/ngx-sails/sails-client/sails-client.service.js
echo "node_modules/ngx-sails/sails-client/sails-client.service.js: Observable import updated"

sed -i "s/import { Subject } from 'rxjs\/Subject'/import { Subject } from 'rxjs'/" node_modules/ngx-sails/sails-client/sails-client.service.js
echo "node_modules/ngx-sails/sails-client/sails-client.service.js: Subject import updated"

sed -i "s/import { map } from 'rxjs\/operators\/map'/import { map } from 'rxjs\/operators'/" node_modules/ngx-sails/sails-client/sails-request.js
echo "node_modules/ngx-sails/sails-client/sails-request.js: map import updated"

sed -i "s/import { Observable } from 'rxjs\/Observable'/import { Observable } from 'rxjs'/" node_modules/ngx-sails/sails-client/sails-request.js
echo "node_modules/ngx-sails/sails-client/sails-request.js: Observable import updated"

echo "Updates completed"

exit 0
