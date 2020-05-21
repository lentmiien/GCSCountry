# Empty project

An empty project, used as starting point for other projects.

## Details

1. Is setup with passport and local strategy (has one static user: {username: Lennart, role: admin, password: 123})
2. Has
* an index route that can be accessed by anyone
* a login route that requires you to be logged out
* a mypage route that requires you to be logged in
3. Uses bootstrap styling and javascript

## Startup

1. Download git file and extract to an empty folder
2. Open folder in terminal and run "npm install"
3. Create ".env" based on ".env_sample"
4. Start server by running "npm start"
5. Access "localhost:3000" in browser

## What you would normaly do when starting a new project

1. Setup a database
2. Change login to use database instead of static user data
3. Create a register endpoint and register page in index route
