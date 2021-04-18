## User:

Add authentication first

GET:

- Get an overview of all of my projects.
- Get an overview of one specific project.
- Get an overview of all donations made for a specific project.

POST:

- Create a new project
- Add a tag to a project

PATCH/PUT:

- Update my user profile (first & last name, email, bank account)
- Update my projects name, description & tags

DELETE:

- Delete projects

## Visitor

GET:

Can be combined in one endpoint

- See an overview of most recent projects (x number per page)
- See top 5 most funded projects based on amount
- See top 5 most funded projects based on number of transactions
- Search projects by tags

## Donation maker:

GET:

- Get an overview of my donation (which project I backed, the amount I donated and my comment(if I made one))

POST:

- Make a new donation for a specific project
