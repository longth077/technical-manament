require('dotenv').config();
const createApp = require('./app');

const PORT = Number(process.env.PORT || 3001);

createApp()
  .then((app) => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start backend:', error);
    process.exit(1);
  });
