# 🔌 API Specification & Usage Reference

This guide serves as the definitive reference manual for the **GREECE** REST API. It outlines the base configurations, authentication models, response envelopes, error schemas, and endpoint request/response payloads.

---

## 🌐 API Access Parameters

* **Base URL**: `http://localhost:3001/api`
* **Interactive Swagger UI**: `http://localhost:3001/api-docs`
* **Raw OpenAPI 3.1.0 Spec**: `http://localhost:3001/api-docs.json`

---

## 🔒 Authentication & Headers

Currently, all endpoints operate in public-access mode. Headers required for general requests:

| Header Name | Type | Value / Format | Description |
| :--- | :--- | :--- | :--- |
| `Content-Type` | String | `application/json` | Required for all `POST` payloads. |

---

## 📦 Global Response Envelopes

The API uses standardized JSON envelopes to return response data:

### Success Response Envelope (HTTP 200/201)
```json
{
  "status": "success",
  "data": {
    "products": []
  }
}
```

### Error Response Envelope (HTTP 4xx/5xx)
```json
{
  "error": "Error message description",
  "details": []
}
```

---

## 🔌 API Endpoints Registry

### 1. Health Status
#### `GET /healthz`
Retrieves the operational health status of the API server and dependencies.

* **Status Codes**:
  * `200 OK`: Server is fully operational.
* **Response Example**:
  ```json
  {
    "status": "ok"
  }
  ```
* **Verification Command**:
  ```bash
  curl http://localhost:3001/api/healthz
  ```

---

### 2. Products List
#### `GET /products`
Returns all active products within the streetwear catalog, including names, descriptions, images, prices, and sizes.

* **Status Codes**:
  * `200 OK`: Catalog fetched successfully.
* **Response Example**:
  ```json
  {
    "products": [
      {
        "id": "prod_1",
        "name": "HORUS HOODIE",
        "description": "Heavyweight premium cotton hoodie featuring signature Horus embroidery.",
        "imageUrl": "HORUS-HOODIE.jpg",
        "price": 1200,
        "sizes": ["M", "L", "XL"]
      }
    ]
  }
  ```
* **Verification Command**:
  ```bash
  curl http://localhost:3001/api/products
  ```

---

### 3. Contact Form Submission
#### `POST /contact`
Submits feedback or queries from the storefront contact page.

* **Request Body Validation**:
  * `name` (String): Non-empty.
  * `email` (String): Valid email format.
  * `message` (String): Non-empty.
  * `subject` (String, Optional): Subject text.
* **Status Codes**:
  * `200 OK`: Message received successfully.
  * `400 Bad Request`: Payload validation failed.
* **Response Example**:
  ```json
  {
    "success": true,
    "message": "Message received. We'll reply within 24 hours."
  }
  ```
* **Verification Command**:
  ```bash
  curl -X POST http://localhost:3001/api/contact \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Ahmed",
      "email": "ahmed@example.com",
      "subject": "Store Opening Hours",
      "message": "When will the Cairo physical store open?"
    }'
  ```

---

### 4. Create Checkout Session
#### `POST /checkout`
Initializes a new customer order checkout transaction. Instantiates a Stripe Session if configured, otherwise falls back to a simulated mock session.

* **Request Body Validation**:
  * `items` (Array): Minimum 1 item required.
    * `product.name` (String): Non-empty.
    * `product.price` (Number): Positive value.
    * `quantity` (Integer): Positive value.
  * `successUrl` (String): Valid redirect target URL on success.
  * `cancelUrl` (String): Valid redirect target URL on cancellation.
* **Status Codes**:
  * `200 OK`: Checkout Session created.
  * `400 Bad Request`: Validation failure.
* **Response Example (Stripe Enabled)**:
  ```json
  {
    "url": "https://checkout.stripe.com/pay/cs_test_abcdef123...",
    "sessionId": "cs_test_abcdef123..."
  }
  ```
* **Response Example (Mock Fallback)**:
  ```json
  {
    "url": "http://localhost:5173/success?order_id=OHN-9876543210&total=1200",
    "sessionId": "OHN-9876543210"
  }
  ```
* **Verification Command**:
  ```bash
  curl -X POST http://localhost:3001/api/checkout \
    -H "Content-Type: application/json" \
    -d '{
      "items": [
        {
          "product": {
            "name": "CLEOPATRA CAP",
            "price": 450
          },
          "quantity": 1
        }
      ],
      "successUrl": "http://localhost:5173/success",
      "cancelUrl": "http://localhost:5173/cancel"
    }'
  ```

---

### 5. Order Tracking
#### `GET /track-order`
Retrieves order fulfillment status based on unique order reference credentials.

* **Query Parameters**:
  * `id` (String): Unique order tracker ID.
  * `email` (String): Customer email associated with order.
* **Status Codes**:
  * `200 OK`: Order found and status retrieved.
  * `404 Not Found`: No order matching credentials.
  * `400 Bad Request`: Missing parameters.
* **Response Example**:
  ```json
  {
    "order": {
      "id": "OHN-1234567890",
      "items": [
        {
          "name": "SPHINX SWEATPANTS",
          "price": 950,
          "quantity": 1
        }
      ],
      "total": 950,
      "status": "confirmed",
      "created_at": "2026-05-21T10:00:00Z"
    }
  }
  ```
* **Verification Command**:
  ```bash
  curl "http://localhost:3001/api/track-order?id=OHN-1234567890&email=john@example.com"
  ```

---

## 🛡️ Error Schemas & Codes

### Schema Validation Errors (Zod)
When request payload parameters do not match schema configurations, the server outputs `400 Bad Request` containing parameter paths and mismatch codes:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_string",
      "validation": "email",
      "path": ["email"],
      "message": "Invalid email"
    }
  ]
}
```

---

## 📦 Client-Side SDK Integration

Frontend components access API endpoints using the Orval-generated TypeScript library.

```typescript
import { healthCheck, createCheckout, submitContact, getProducts } from '@/api/generated/api';

// Fetch all available apparel products
const { products } = await getProducts();

// Trigger a checkout session redirect
const response = await createCheckout({
  items: [
    {
      product: {
        name: 'NILE JOGGERS',
        price: 900
      },
      quantity: 1
    }
  ],
  successUrl: 'https://greece-hieroglyphs.com/success',
  cancelUrl: 'https://greece-hieroglyphs.com/cart'
});

// Route user to target host
window.location.href = response.url;
```
