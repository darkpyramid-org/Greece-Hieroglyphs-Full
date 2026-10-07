/**
 * Swagger/OpenAPI configuration
 * Generates API documentation
 */

export const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "GREECE HIEROGLYPHS API",
    description: "Egyptian & Greek Hieroglyphs Streetwear E-commerce API. Built with Dark Pyramid.",
    version: "1.0.0",
    contact: {
      name: "Dark Pyramid Support",
      email: "darkpyramid.solutions@gmail.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Development server",
    },
    {
      url: "https://www.darkpyramid.net/api",
      description: "Production server",
    },
  ],
  paths: {
    "/api/healthz": {
      get: {
        summary: "Health check",
        description: "Check if the API is running",
        tags: ["Health"],
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/checkout": {
      post: {
        summary: "Create checkout session",
        description: "Create a Stripe checkout session or mock order",
        tags: ["Orders"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "items",
                  "successUrl",
                  "cancelUrl",
                  "customerEmail",
                  "customerName",
                ],
                properties: {
                  items: {
                    type: "array",
                    minItems: 1,
                    maxItems: 50,
                    items: {
                      type: "object",
                      required: ["product", "quantity"],
                      properties: {
                        product: {
                          type: "object",
                          required: ["id"],
                          description:
                            "Only `id` is honoured; price/name are ignored and re-resolved from the catalog.",
                          properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            price: { type: "integer" },
                            description: { type: "string" },
                          },
                        },
                        quantity: { type: "integer", minimum: 1, maximum: 99 },
                        size: { type: "string" },
                        color: { type: "string" },
                      },
                    },
                  },
                  successUrl: {
                    type: "string",
                    format: "uri",
                    description:
                      "Must point at an allow-listed storefront origin.",
                  },
                  cancelUrl: {
                    type: "string",
                    format: "uri",
                    description:
                      "Must point at an allow-listed storefront origin.",
                  },
                  customerEmail: { type: "string", format: "email" },
                  customerName: { type: "string" },
                  shippingAddress: { type: "object" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Checkout session created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["url", "sessionId", "orderId", "total"],
                  properties: {
                    url: { type: "string", format: "uri" },
                    sessionId: { type: "string" },
                    orderId: {
                      type: "string",
                      description: "Human-readable order reference, e.g. OHN-…",
                    },
                    total: {
                      type: "integer",
                      description: "Order total in piastres (EGP minor units)",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description:
              "Validation failed, or successUrl/cancelUrl points at a disallowed origin",
          },
          "429": {
            description: "Too many checkout attempts from this client",
          },
          "502": {
            description: "Payment provider unavailable",
          },
          "503": {
            description: "Catalog unavailable; retry shortly",
          },
        },
      },
    },
    "/api/contact": {
      post: {
        summary: "Send contact message",
        description: "Submit a contact form message",
        tags: ["Contact"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "message"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  subject: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Message received",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation error",
          },
        },
      },
    },
    "/api/products": {
      get: {
        summary: "Get products",
        description: "Retrieve list of products",
        tags: ["Products"],
        responses: {
          "200": {
            description: "Products list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: {
                        type: "object",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        summary: "Get product by ID or slug",
        description: "Looks the product up by primary key, then by slug.",
        tags: ["Products"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Product",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { product: { type: "object" } },
                },
              },
            },
          },
          "404": { description: "Product not found" },
        },
      },
    },
    "/api/products/category/{category}": {
      get: {
        summary: "List products in a category",
        tags: ["Products"],
        parameters: [
          {
            name: "category",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Products list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/products/search/{query}": {
      get: {
        summary: "Search products by name",
        tags: ["Products"],
        parameters: [
          {
            name: "query",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Products list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/track-order": {
      get: {
        summary: "Track an order",
        description:
          "Requires the order ID and the email used at checkout. Rate limited to 20 requests/minute per client.",
        tags: ["Orders"],
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "email",
            in: "query",
            required: true,
            schema: { type: "string", format: "email" },
          },
        ],
        responses: {
          "200": {
            description: "Order found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { order: { type: "object" } },
                },
              },
            },
          },
          "404": { description: "Order not found" },
          "429": { description: "Too many lookup attempts" },
        },
      },
    },
    "/api/setup": {
      get: {
        summary: "API setup status",
        description: "Check API setup and configuration",
        tags: ["Health"],
        responses: {
          "200": {
            description: "Setup status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              message: { type: "string" },
              statusCode: { type: "number" },
              details: { type: "object" },
            },
          },
        },
      },
    },
  },
};
