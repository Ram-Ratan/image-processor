# Components

## 🌐 API Server Components

### Main Server Setup

- **Location**: `src/index.ts`
- **Purpose**: Initiate the app
- **Features**:
  - Initialise app server

### Fastify Setup

- **Location**: `src/infrastructure/fastify/index.ts`
- **Purpose**: Core server configuration
- **Features**:
  - Server initialization
  - Middleware setup
  - Route registration

### Error Handler

- **Location**: `src/infrastructure/fastify/error-handler/index.ts`
- **Purpose**: Central error management
- **Features**:
  - Error standardization
  - Status code mapping
  - Error logging

### Plugins

- **Location**: `src/infrastructure/fastify/plugins/common.ts`
- **Purpose**: Fastify plugin configuration
- **Features**:
  - CORS setup
  - Compression
  - Request parsing
  - Security headers

### Route Handlers

- **Location**: `src/app/routes`
- **Purpose**: API endpoint definitions
- **Key Routes**:
  - File upload endpoints
  - Processing status checks
  - Health checks

## 🔄 Processing Components

### Image Worker

- **Location**: `src/app/workers/imageWorker.ts`
- **Purpose**: Asynchronous image processing
- **Features**:
  - Image resizing
  - Format conversion
  - Quality optimization
  - Status Update
  - Webhook Calls

### Queue Management

- **Location**: `src/app/queues/imageQueue.ts`
- **Purpose**: Job queue handling with BullMQ
- **Features**:
  - Job scheduling
  - Retry mechanisms
  - Progress tracking

## 💾 Storage Components

### Cloud Storage

- **Location**: `src/infrastructure/storage/index.ts`
- **Purpose**: AWS S3 integration
- **Features**:
  - Image upload/download
  - Bucket management
  - Access control

### Database Client

- **Location**: `src/infrastructure/database/index.ts`
- **Purpose**: Initiating database client
- **Features**:
  - create prisma client once and reuse it later.

  ## 📚 Repository Layer

  ### Base Repository

  - **Location**: `src/infrastructure/repository/BaseRepository.ts`
  - **Purpose**: Abstract database operations
  - **Features**:
    - CRUD operations
    - Transaction handling
    - Query building

  ### Product Repository

  - **Location**: `src/infrastructure/repository/ProductRepository.ts`
  - **Purpose**: Product-specific data operations
  - **Features**:
    - Product queries
    - Bulk operations
    - Status updates

  ### Image Repository

  - **Location**: `src/infrastructure/repository/ImageRepository.ts`
  - **Purpose**: Image metadata management
  - **Features**:
    - Image tracking
    - Processing status
    - Relationship mapping

## 📊 Data Models

### Database Schema

- **Location**: `prisma/schema.prisma`
- **Purpose**: Database structure definition
- **Entities**:
  - Products
  - Images
  - ProcessingRequest

### TypeScript + Zod Models

- **Location**: `src/domain/models/product.ts`
- **Purpose**: Type definitions and runtime validation
- **Features**:
    - Zod schema definitions
    - TypeScript interfaces
    - Type inference from schemas
    - Runtime validation
    - Custom validation rules
    - Error messages customization

## 🛠 Services

### Upload Service

- **Location**: `src/app/services/UploadProductService.ts`
- **Purpose**: Handle product uploads
- **Features**:
  - Add Product and Images in db with status pending
  - Enqueue image-processing job
  - Return requestId to get status

### Status Service

- **Location**: `src/app/services/GetStatusService.ts`
- **Purpose**: Process status tracking
- **Features**:
  - Used to get status of image processing by request Id

## 🏗 Infrastructure

### Docker Configuration

- **Location**: `docker-compose.yml`
- **Purpose**: Container orchestration
- **Services**:
  - PostgreSQL
  - BullMQ(Redis)
  - Application server

### Logging

- **Location**: `src/shared/logger/index.ts`
- **Purpose**: Application logging
- **Features**:
  - Log levels
  - Format configuration
  - Transport setup

### Environment Config

- **Location**: `src/shared/constants/env.ts`
- **Purpose**: Environment variables
- **Features**:
  - Configuration loading
  - Validation
  - Default values

## 🔧 Tech Stack

- TypeScript
- Fastify
- Prisma
- BullMQ
- AWS S3
- PostgreSQL
- Redis


<!-- model ProcessingRequest {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())   
  finishedAt  DateTime?                    
  status      Status   @default(PENDING)    
  webhookUrl  String?                        
  products    Product[]                    
}

model Product {
  id          String   @id @default(uuid())  
  requestId   String
  name        String
  serialNo    Int           
  request     ProcessingRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)
  images      Image[]          
}

model Image {
  id          String   @id @default(uuid())  
  productId   String
  product     Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  inputUrl    String          
  outputUrl   String?         
  status      Status   @default(PENDING)  
  order       Int              
  createdAt   DateTime @default(now())
}

enum Status {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
} -->

## 📝 Database Tables

### Processing Request Table

| Column Name | Type | Description |
| --- | --- | --- |
| id | UUID (PK) | Unique identifier |
| createdAt | TIMESTAMP | Creation timestamp |
| finishedAt | TIMESTAMP | Completion timestamp |
| status | ENUM | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED` |
| webhookUrl | STRING | Optional callback URL |

### Products Table

| Column Name | Type | Description |
| --- | --- | --- |
| id | UUID (PK) | Unique product identifier |
| requestId | UUID (FK) | Associated request |
| name | STRING | Product name |
| serialNo | INTEGER | Product serial number |

### Images Table

| Column Name | Type | Description |
| --- | --- | --- |
| id | UUID (PK) | Unique image identifier |
| productId | UUID (FK) | Associated product |
| inputUrl | STRING | Original image URL |
| outputUrl | STRING | Processed image URL |
| status | ENUM | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED` |
| order | INTEGER | Image sequence number |
| createdAt | TIMESTAMP | Creation timestamp |



## Folder Structure

```
user-service/
├── .gitignore
├── package.json
├── prisma/
│   └── schema.prisma
├── readme.md
├── src/
│   ├── app/
│   │   └── routes/
│   │       └── health.ts
│   ├── index.ts
│   ├── infrastructure/
│   │   └── fastify/
│   │       ├── error-handler/
│   │       │   └── index.ts
│   │       ├── index.ts
│   │       └── plugins/
│   │           └── common.ts
│   └── shared/
│       ├── constants/
│       │   └── env.ts
│       └── logger/
│           └── index.ts
├── tsconfig.json
└── tsup.config.ts
```
