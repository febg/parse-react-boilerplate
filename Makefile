build.web:
	docker build -f web_client/Dockerfile -t parse-react-boilerplate/web_client web_client

build.parse:
	docker build -f parse_server/Dockerfile -t parse-react-boilerplate/parse_server parse_server

build.all:
	$(MAKE) build.parse
	$(MAKE) build.web

install.web:
	cd web_client && npm install

install.parse:
	cd parse_server && npm install

install.all:
	$(MAKE) install.parse
	$(MAKE) install.web

full:
	$(MAKE) install.all
	$(MAKE) build.all
	$(MAKE) compose

mongo.dump:
	docker-compose exec -T mongo sh -c 'mongodump -o data/db/dump'
	cp data-db/dump/dev/* mongo-seed/dump/dev
	find mongo-seed -type f ! -name "*_SCHEMA*" -delete

mongo.restore:
	mkdir -p data-db/dump/dev && cp mongo-seed/dump/dev/* data-db/dump/dev
	docker-compose exec -T mongo sh -c 'mongorestore /data/db/dump/'

test.parse_server:
	./scripts/test.sh "parse_server"

test.web_client:
	./scripts/test.sh "web_client"
