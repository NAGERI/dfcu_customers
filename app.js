require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");
const helmet = require("helmet");
const customerRouter = require("./routes/customer");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DFCU Customer API documentation",
      version: "0.1.0",
      description:
        "This is a simple API made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Nageri",
        url: "https://github.com/nageri",
        email: "onacedricnageri@gmail.com",
      },
    },
    customCss: ".swagger-ui .topbar { display: none }",
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Development Server",
      },
    ],
  },
  apis: ["./controllers/*.js", "./routes/*js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.use(cors());

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
// routes
app.get("/", (req, res) => {
  res.send(
    "<h1>DFCU Customer API</h1> <br> <h2> Go to /api/v1/customers </h2>"
  );
});

app.get("/admin", (req, res) => {
  res.send("<h1>ADMIN Dashboard</h1>");
});
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1", require("./routes/requests"));
const port = process.env.PORT || 5000;

try {
  connectDB(process.env.MONGODB_URI);
  app.listen(port, console.log(`Server is runnung on port ${port}`));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
