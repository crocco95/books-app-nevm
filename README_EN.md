# Books App
A simple NEVM application to manage books 📚

## Current features:
* User preferences
* Home personalized based on preferences
* Search books using the search page on frontend (powered by Google APIs)
* Users registration & login (powered by Google Firebase Authentication APIs)
* Users reviews
* Email notifications
* Saving on DB personal data such as page read for each book, books read, etc.
* Decent user profile page
* Follow - Following users logic
* Docker infrastructure

## Next features
* No additional features expected

## Minimum Requirements
* Docker 
* Docker Swarm
* Docker Compose (if Docker version does not include Docker Compose)

## Quick start
For a simple quick start there are 2 files, one for dev stage and another pro production:
* start_dev.sh : start the Docker environment in dev stage
* start_prod.sh : start the Docker environment in prod stage

NOTE: to start the infrastructure you have to insert in the project the Service Account Key, a JSON file that contains the Google Firebase authentication infos. If you have not the file, follow the instruction in the CLI after run the start_*.sh file.
## Manual Installation

### Start RabbitMQ instance
Before to start every other component is necessary to start RabbitMQ container instance.
In order to do that execute:

```bash
#!/bin/bash
$ cd ./docker
$ docker-compose -f docker-compose.[dev/prod].yml --project-name=mevn_books up --build -d rabbitmq
```

If it is the first start, the docker script will creates queues, users, etc so it will take a while before to be completed started.
The RabbitMQ container in DEV will expose the port ```5672``` for the connection with external connection and ```15672``` to access at management UI.
In production environment all ports are closed.

### Start backend
Before to run the project, go inside backend/book/.env file and change the
Google Books API key with yours.

#### Development
Use Docker dev/local infrastructure by launching:
```bash
#!/bin/bash
$ cd ./docker
$ docker-compose -f docker-compose.dev.yml --project-name=mevn_books up --build -d [service name]
```
There isn't a dedicated web server and by default the gateway service listen on port ```8080```, the other services are hidden behind it and they are not
accessible directly.
#### Production
Go to Docker directory and execute:
```bash
#!/bin/bash
$ cd ./docker
$ docker-compose -f docker-compose.prod.yml --project-name=mevn_books up --build -d [service name]
```
The Dockerfile in this case will execute the command ```npm run build``` and than
copy the distribution directory to be served using NGINX web server.
By default the gateway listen on port ```8080```, the other services are hidden behind it and they are not accessible directly.

#### Tests
There are tests for all microservices and for each one there are 2 commands to execute tests:
* ```npm test``` : run all tests with coverage and exit.
* ```npm run test-n-watch``` : run all tests and remain in watch mode.

**NOTE**: In order to run these commands it's necessary to edit DB config file ```host``` value or execute the commands directly inside the container because the DB host is set on container internal Docker hostname. If you want to change the ```host``` value, I suggest to use the IP address ```0.0.0.0``` and change port according to the exposed Docker container port.

At the moment the code coverage is good and there are both unit and integration tests.
All tests are triggered by CI GitHub actions (source on ```.github/workflows```)
### Start frontend
First thing first, go to ```fronted/config``` and taking the file ```firebase_sample.js``` as example, create a new one named ```firebase.js```
with inside the Firebase API configs taken from Firebase Console.

Now you can start the frontend client by typing:

#### Development
For local purpose w/o Docker
```bash
#!/bin/bash
$ npm serve # Watchout for VueJS version installed in your machine 
```
For local purpose w/ Docker
```bash
#!/bin/bash
$ docker-compose -f docker-compose.dev.yml --project-name=mevn_books up --build -d frontend
```
With this configuration you can continue to develop on local and the containers
will update every time you save because of the volumes.
By default the frontend listen on port ```8081```.
#### Production
Go to Docker directory and execute:
```bash
#!/bin/bash
$ docker-compose -f docker-compose.prod.yml --project-name=mevn_books up --build -d frontend
```
The Dockerfile in this case will execute the command ```npm run build``` and
than copy the distribution directory to be served using NGINX web server.
By default the frontend listen on port ```8000```.