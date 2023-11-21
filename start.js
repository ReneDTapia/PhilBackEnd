
const createApp = require('./server');

async function startServer() {
  const app = await createApp();
  const PORT = process.env.PORT || 5005;

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

startServer();
