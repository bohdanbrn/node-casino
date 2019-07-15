module.exports = {
    development: {
        username: "postgres",
        password: "postgres",
        database: "node-casino",
        dialect: "postgres",
        secret_key: "devSecretKey"
    },
    test: {
        dialect: "postgres",
        secret_key: "testSecretKey"
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: "postgres",
        use_env_variable: "DATABASE_URL",
        secret_key: process.env.SECRET_KEY
    }
};
