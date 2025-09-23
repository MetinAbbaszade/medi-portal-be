const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "MediPortal API",
        version: "1.0.0",
        description: "API documentation for MediPortal",
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Hospital: {
                type: "object",
                properties: {
                    id: { type: "string", example: "HSP-003" },
                    name: { type: "string", example: "City Heart Institute" },
                    type: { type: "string", example: "Cardiac Specialty Hospital" },
                    image: { type: "string", example: "https://images.unsplash.com/photo-1504439468489-c8920d796a29" },
                    description: { type: "string", example: "Advanced cardiac and vascular treatments with world-class surgical units." },
                    addresses: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                street: { type: "string" },
                                city: { type: "string" },
                                state: { type: "string" },
                                zip: { type: "string" },
                                country: { type: "string" }
                            }
                        }
                    },
                    capacities: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                beds: { type: "integer" },
                                icu_beds: { type: "integer" },
                                emergency_capacity: { type: "integer" }
                            }
                        }
                    },
                    contacts: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                phone: { type: "string" },
                                email: { type: "string" },
                                website: { type: "string" }
                            }
                        }
                    },
                    departments: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                head: { type: "string" },
                                name: { type: "string" },
                                icon: { type: "string" }
                            }
                        }
                    },
                    specialties: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                name: { type: "string" }
                            }
                        }
                    }
                }
            }
        }
    }
};

const options = {
    definition: swaggerDefinition,
    apis: ["./routers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;