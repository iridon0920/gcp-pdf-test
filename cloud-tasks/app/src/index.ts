import { createHttpTaskWithToken } from './createTask';
import express from 'express';

const app: express.Express = express();

const { QUEUE_NAME } = process.env;
const { QUEUE_LOCATION } = process.env;
const { FUNCTION_URL } = process.env;
const { SERVICE_ACCOUNT_EMAIL } = process.env;

app.use(express.urlencoded({ extended: true }));

app.post('/create-pdf', (req, res) => {
  // Set the task payload to the form submission.

  createHttpTaskWithToken(
    process.env.GOOGLE_CLOUD_PROJECT as string,
    QUEUE_NAME as string,
    QUEUE_LOCATION as string,
    FUNCTION_URL as string,
    SERVICE_ACCOUNT_EMAIL as string
  )
    .then(() => res.status(202).send('PDF作成タスクを作成'))
    .catch(() => {
      console.log('error');
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
