# Daily Diet API 🥗

<p align="center">
  <img src="https://img.shields.io/badge/Enviroment-NodeJS-green"/> 
  <img src="https://img.shields.io/badge/Framework-fastify-orange"/> 
  <img src="https://img.shields.io/badge/Language-TypeScript-blue"/> 
  <img src="https://img.shields.io/badge/Test-Vitest-red"/> 
</p>

Daily Diet is an API designed for you to keep track of your meals posting, updating e retrieving your personal metrics.

##  Getting Started 🚀<br/>
To get started with the API, clone this repository to your local machine and run the following <br/>
commands to start the application: <br/>

1. Clone this repository to your local machine.`https://github.com/mandacosta/daily-diet-api.git`
2. Next, navigate to the project directory and run the following command to restore the dependencies:
`npm install`
3. Configure a ".env" file according to the ".env.example" file already present in the repository. Choose a PORT. The default will be 3000.
4. Finally, run the following command to start the API:
`npm run dev`
5. The application will start listening on http://localhost:3000 <br/><br/>

## Current features :clipboard: <br/>
- `POST /user` - creates a new user to the API.
- `POST /meal` - creates a new meal.
- `PATCH /meal/{id}` - updates a specified meal by id.
- `GET /meal/{id}` - retrieves a specified meal by id.
- `DELETE /meal/{id}` - deletes a specified meal by id.
- `GET /meal` - retrieves all posted meals for the logged in user.
- `GET /meal/metrics` - retrieves a set of metrics for the logged in user. <br/><br/>

## NEXT: API Documentation 📝 :dart: <br/>
The API endpoints will be documented using Swagger
