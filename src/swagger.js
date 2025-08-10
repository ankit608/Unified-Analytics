// swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Analytics & Auth API",
    version: "1.0.0",
    description: "API documentation for analytics and authentication services"
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local server"
    }
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key"
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ["./src/Routes/*.js"], // matches src/Routes/auth.js and src/Routes/analytics.js
};

const swaggerSpec = swaggerJSDoc(options);

export function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Swagger docs available at http://localhost:5000/api-docs");
}
