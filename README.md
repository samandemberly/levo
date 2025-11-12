Hello

To run this project you'll need postgresql@15
Open Terminal
I added it with `brew install postgresql@15`
You'll need to add the path to postgresql@15 to your .zshrc or .bash_profile and make sure there are no other references to postgresql@15

Mine looks like
export PATH="/usr/local/opt/postgresql@15/bin:$PATH"

You'll need to create a database now
run `createdb postgres -O cole`

Then
then `psql postgres`

ALTER USER cole WITH PASSWORD 'password';

# Grant privileges on your database
GRANT ALL PRIVILEGES ON DATABASE postgres TO cole;

The db server is running on 5432

Run `brew services start postgresql@15`

Make sure there's nothing else running on 5432
check
`lsof -i :5432`

if there are kill the processes
you'll see the PID in the list from above if there are any
`kill -9 PID`

Alright, if `brew services start postgresql@15` is running

in the `weather-etl/backend` directory, run
`npm install`

then run
`node server.js`

This should start the backend service and run the etl.

Alright, there's a simple client

In the `weather-etl/frontend/app` directory, run
`npm install`

In the `weather-etl/frontend/app` directory run `npm run dev`

It should spin up http://localhost:5173/, but it will tell which port it's running on

You can run a couple queries there

To run tests

in the `weather-etl/backend` run
`npm test`
