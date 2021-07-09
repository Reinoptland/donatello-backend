const faker = require("faker");
const { User, Project, Donation, Tag } = require("../models");
const bcrypt = require("bcrypt");
const saltRound = 10;

const users = [...Array(100)].map((user) => ({
  id: faker.datatype.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: bcrypt.hashSync("fakepassword", saltRound),
  iBan: faker.finance.iban(),
  createdAt: faker.date.past(1),
  updatedAt: new Date(),
}));

const tags = [
  "Art&Music",
  "Product",
  "Social",
  "Technology",
  "Sports",
  "Games",
  "Kids",
  "Fashion",
  "Health",
  "Community",
  "Sustainability",
  "Education",
  "Startup",
];

// console.log("users:", users)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("users", users, {});

    const tagsSeed = tags.map((tag) => ({
      name: tag,
      id: faker.datatype.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("tags", tagsSeed, {});

    const usersArray = await User.findAll();
    const randomIndex = (max) => Math.floor(Math.random() * max);
    const projects = [...Array(100)].map((project) => {
      const randomId = randomIndex(99);

      return {
        id: faker.datatype.uuid(),
        projectName: faker.company.bsBuzz(),
        projectDescription: faker.company.catchPhrase(),
        userId: usersArray[randomId].id,
        createdAt: faker.date.past(1),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("projects", projects, {});

    const projectsArray = await Project.findAll();
    const paymentStatusArray = [
      "open",
      "paid",
      "expired",
      "failed",
      "canceled",
    ];
    const donations = [...Array(250)].map((donation) => ({
      id: faker.datatype.uuid(),
      donationAmount: faker.datatype.number(1000),
      projectId: projectsArray[randomIndex(99)].id,
      molliePaymentId: "tr_" + faker.datatype.string(10),
      paymentStatus: paymentStatusArray[randomIndex(4)],
      createdAt: faker.date.past(1),
      updatedAt: new Date(),
    }));

    let projectTotals = {};
    for (const donation of donations) {
      if (projectTotals.hasOwnProperty(donation.projectId)) {
        const projectToUpdate = projectTotals[donation.projectId];
        projectToUpdate.totalDonationAmount += donation.donationAmount;
        projectToUpdate.totalDonationCount += 1;
      } else {
        projectTotals[donation.projectId] = {
          totalDonationAmount: donation.donationAmount,
          totalDonationCount: 1,
        };
      }
    }

    Object.keys(projectTotals).forEach(async (id) => {
      await Project.update(projectTotals[id], { where: { id: id } });
    });

    await queryInterface.bulkInsert("donations", donations, {});

    const tagsFromDB = await Tag.findAll();

    const projectstags = [...Array(100)].map((projecttag) => ({
      projectId: projectsArray[randomIndex(99)].id,
      tagId: tagsFromDB[randomIndex(9)].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    return await queryInterface.bulkInsert("projectstags", projectstags, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("projects", null, {});
    await queryInterface.bulkDelete("tags", null, {});
    await queryInterface.bulkDelete("donations", null, {});
    await queryInterface.bulkDelete("projectstags", null, {});
  },
};
