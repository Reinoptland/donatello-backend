require("dotenv").config();

module.exports = {
  development: {
    use_env_variable: "DEV_DATABASE_URL",
    dialect: "postgres",
    pool: {
      max: 4,
    },
    logging: false,
  },
  test: {
    use_env_variable: "TEST_DATABASE_URL",
    dialect: "postgres",
    pool: {
      max: 4,
    },
    logging: false,
  },

  production: {
    use_env_variable: "PROD_DATABASE_URL",
    dialect: "postgres",
    pool: {
      max: 4,
    },
    logging: true,
  },
};
