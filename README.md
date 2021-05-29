## What is Donatello?

Donatello is a public donations platform with a Dockerized backend built on NodeJS with Express. The database layer is managed by PostgreSQL and Sequelize ORM. I've implemented Mollie which manages the payment transactions. There is an internal reporting dashboard which uses raw SQL to query the data. The app was developed following a TDD approach by using Jest & Supertest.

## ERD

![ERD](./images/erd.png)

### User:

POST:

- Signup
- Login
- Create a new project
- Add a tag to a project

GET:

- See all of my user details

PATCH/PUT:

- Update my user profile (first & last name, email, password, bank account)
- Update my projects name, description
- Update my projects tags

DELETE:

- Delete projects
- Delete a tag from a project
- Delete my account

### Visitor

GET:

- Get the 10 most recent projects (x number per page) / the 10 most funded projects based on amount / the 10 most popular projects based on number of transactions / filter projects by tags
- Get a list of all of projects for a specific user.
- Get an overview of one specific project & all donations made for it.

### Donation maker:

POST:

- Make a new donation for a specific project POST projects/:projectId/donations
- Webhook to update status of payments & total amount & count POST /webhooks/transactions
