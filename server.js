const config = require("././backend/config/config");

// exception handling

process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    process.exit(1);
});

const app = require("./app");

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}...`);
});
