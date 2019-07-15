# Node.js Casino

A simple Node.js application with Express.js and Sequelize (PostgreSQL).
The application creates casino's pages for play a games. And also dashboard for manage.

## Getting Started

To get started, you need to install packeges:

```
npm install
```

**Configure config file with your data**

```
config/config.js
```

**Running app**

```
npm start
```

**Run watcher**

```
npm run watch
```


On the server we have the following endpoint:

Endpoint | Description
----------|------------
GET http://localhost:3000/ | client side (for play game)
GET http://localhost:3000/dashboard | dashboard (for manage)

Before use client side, need to create casinos and game machines for them in dashboard.