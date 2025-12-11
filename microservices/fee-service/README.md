# Fee Management Service

Microservice responsible for managing fee structures, payments, and financial operations.

## Features

- Fee structure management
- Payment processing (Cash, Mobile Money, Bank Transfer)
- MTN Mobile Money integration
- Airtel Money integration
- Payment tracking and receipts
- Fee waivers and scholarships
- Payment installments

## API Endpoints

### Fee Structures
- `GET /api/v1/fee-structures` - Get all fee structures
- `GET /api/v1/fee-structures/:id` - Get fee structure by ID
- `POST /api/v1/fee-structures` - Create fee structure (Admin)

### Payments
- `GET /api/v1/payments` - Get all payments (with pagination)
- `GET /api/v1/payments/:id` - Get payment by ID
- `POST /api/v1/payments` - Create payment
- `PATCH /api/v1/payments/:id/status` - Update payment status (Admin)

## Payment Methods

- Cash
- MTN Mobile Money
- Airtel Money
- Bank Transfer
- Cheque
- Card

## Port

Default port: `3005`
