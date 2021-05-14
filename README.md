## User:

- ~~Authentication~~

POST:

- ~~Signup~~
- ~~Login~~
- ~~Create a new project~~
- ~~Add a tag to a project~~

GET:

- ~~See all of my user details~~

PATCH/PUT:

- ~~Update my user profile (first & last name, email, password, bank account)~~
- ~~Update my projects name, description~~
- ~~Update my projects tags~~

DELETE:

- ~~Delete projects~~
- ~~Delete a tag from a project~~
- ~~Delete my account~~

## Visitor

GET:

Can be combined in one endpoint

- ~~Get the 10 most recent projects (x number per page)~~
- ~~Get the 10 most funded projects based on amount~~
- ~~Get the 10 most popular projects based on number of transactions~~

- Search projects by tags

- ~~Get a list of all of projects for a specific user.~~
- ~~Get an overview of one specific project & all donations made for it.~~

## Donation maker:

GET:

- Get an overview of my donation (which project I backed, the amount I donated and my comment(if I made one))

POST:

- Make a new donation for a specific project POST projects/:projectId/donations
  - Create a donation
  - Create a mollie payment
  - store the payment id in the donation "tr_bla"
  - add the needed columns to the Donation model - status and payment id
- Webhook to update status of payments & total amount & count POST /webhooks/transactions
  - Find the donation by the payment id
  - Find donation by the payment id from mollie
  - Update the status of the donation
  - If status was Paid -> update the projects total amount & count
