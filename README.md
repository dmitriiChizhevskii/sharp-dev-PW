### Technology stack
##### Frontend: React, Material UI
##### Backend: NestJS, MongoDB, Prisma (ORM)

### Short descirption
This application supports user authentification and authorization based on Jwt tokens.
Users can transfer virtual money to each other and manage their pesonal accounts.
You can find all oll of the schemas and relations at ./backend/prisma/schema.prisma

### Launch

##### Frontend: 
Dependencies: NodeJS

```
  cd frontend
  npm install
  npm run start
```

env-file:
```
  REACT_APP_ENDPOINT=http://localhost:3001
```

##### Backend: 
Dependencies: Docker, NodeJS, MongoDB
```
  cd backend
  yarn install
  docker-compose up
  npx prisma generate
  npx prisma db push
  yarn start:dev
```

env-file:
```
DATABASE_URL="mongodb://user:password@127.0.0.1:27017/PW?authSource=admin"
AT_SECRET=at-secret
RT_SECRET=rt-secret
AWARD=500
```

All lists of commands for dev, prod, test you can find in the package files.

### features
- Prisma as ORM (you can easilly migrate to any other DB)
- Swagger (You can find at address: REACT_APP_ENDPOINT/swagger)
- Visual editor for the data in your database. (You can launch it with ```npx prisma studio```)
- Root theme config at frontend (you can easily change it)
- i18n at frontend (just add config for any language you want)

### proposals and future plans
-  add adapative design for mobile applications
-  add state manager for frontend to add more certainty and clarity




