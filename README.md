# BasicAuth
Contain a basic auth api with node js(Express)

# First install all dependencies by entering npm install in the terminal or cmd on the project root directory 

# Create .env file with the following text

EMAIL= your GMAIL address
PASSWORD= Gmail password

ACCESSSEC=(jwt token secret)

URL=(mongodb connection url)

# Finally you could install nodemon globally with <  npm i -g nodemon   > and run with nodemon.

# or you could just run <  node index.js  >


********* API Reference ***********

Local   http://localhost:3001/api/auth  
Heroku  https://demo-basic-auth.herokuapp.com/api/auth

method : POST

Body:  
    "email":"*****",
    "password":"*****"

Local   http://localhost:3001/api/users/add
Heroku  https://demo-basic-auth.herokuapp.com/api/users/add

method: POST
Body:
    "name":"****",
	"userName":"*****",  max length 10
	"email":"*****",     please provide real email beacuse a 					 verification mail will be sent to this 					address. With out clicking on that link
						you can't login
	"password":"******", 	min length  5
	"isAdmin":"********" (true/false)


Local  http://localhost:3001/api/users/edit
Heroku  https://demo-basic-auth.herokuapp.com/api/users/edit

method: PUT
After signin you will be provided with a jwt token.
then in headers you have to provide token like

key                      value 
x-auth-token			eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
Content-Type			application/json


Body: 

	"name":"*******",
	"email":"*******"
	"password":"********",
	"isAdmin":"********"

only these 4 fields are changable.
