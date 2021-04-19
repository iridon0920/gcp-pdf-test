import { createHttpTaskWithToken } from './createTask';
import express from 'express';
import { raw } from 'body-parser';
import { Storage } from '@google-cloud/storage';

const app: express.Express = express();

const { QUEUE_NAME } = process.env;
const { QUEUE_LOCATION } = process.env;
const { FUNCTION_URL } = process.env;
const { SERVICE_ACCOUNT_EMAIL } = process.env;

app.use(raw({ type: 'application/octet-stream' }));
app.use(express.urlencoded({ extended: true }));

app.get('/storage', (req, res) => {
  const storage = new Storage();
  const bucket = storage.bucket('pdf-test-77e7c.appspot.com');
  bucket
    .getFiles()
    .then((files) => {
      console.log(files);
      files[0][0]
        .download()
        .then((data) => {
          const contents = data[0];
          res.attachment('test.pdf');
          res.send(contents);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send();
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
});

app.post('/receive-pdf', (req, res) => {
  console.log('PDF作成完了');
  const decodeBody = Buffer.from(req.body, 'base64').toString();
  const body = JSON.parse(decodeBody) as {
    bucket: string;
    id: string;
    name: string;
    selfLink: string;
    mediaLink: string;
  };

  console.log('bucket: ' + body.bucket);
  console.log('id: ' + body.id);
  console.log('name: ' + body.name);
  console.log('selfLink: ' + body.selfLink);
  console.log('mediaLink: ' + body.mediaLink);
  res.status(200).send('作成完了タスク受信');
});

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
