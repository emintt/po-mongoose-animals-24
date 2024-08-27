import app from './app';
import mongoConnect from './utils/db';

const port = process.env.PORT || 3000;
(async () => {
  try {
    await mongoConnect();
    app.listen(port, () => {
      console.log(`Listening: http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Connection to db failed: ', (error as Error).message);
  }
})();

