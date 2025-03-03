# User Service

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