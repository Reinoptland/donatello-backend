const faker = require("faker");
const uuidv4 = require("uuid").v4;

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

const randomIndex = (max) => Math.floor(Math.random() * max);

const fakeUser = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(8),
    iBan: faker.finance.iban(),
  };
};

const fakeProject = (userId) => {
  return {
    projectName: faker.company.bsBuzz(),
    projectDescription: faker.company.catchPhrase(),
    userId,
  };
};

const fakeTags = () => {
  return [tags[randomIndex(12)], tags[randomIndex(12)]];
};

const fakeDonation = (projectId, donationId = uuidv4()) => {
  const paymentStatusArray = ["open", "paid", "expired", "failed", "canceled"];
  return {
    donationId,
    donationAmount: faker.datatype.number(1000),
    molliePaymentId: "tr_" + faker.datatype.string(10),
    paymentStatus: paymentStatusArray[randomIndex(4)],
    createdAt: faker.date.past(1),
    updatedAt: new Date(),
    projectId,
  };
};

module.exports = { fakeUser, fakeProject, fakeTags, fakeDonation };
