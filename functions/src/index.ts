import { v2beta3 } from '@google-cloud/tasks';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import PdfPrinter from 'pdfmake';

admin.initializeApp();

export const createPdfTaskHandler = functions
  .region('asia-northeast1')
  .https.onRequest((req, res) => {
    const printer = new PdfPrinter({
      IpaExg: {
        normal: 'fonts/ipaexg.ttf',
        bold: 'fonts/ipaexg.ttf',
        italics: 'fonts/ipaexg.ttf',
        bolditalics: 'fonts/ipaexg.ttf',
      },
    });

    const dd = {
      content: [
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 100, '*'],

            body: [
              ['First', 'Second', 'Third', 'Fourth'],
              ['ファースト', 'セカンド', 'サード', 'フォース'],
              ['ふぁーすと', 'せかんど', 'さーど', 'ふぉーす'],
              ['一', '二', '三', '四'],
            ],
          },
        },
      ],
      defaultStyle: {
        font: 'IpaExg',
      },
    };

    const pdfDoc = printer.createPdfKitDocument(dd);

    const file = admin.storage().bucket().file('test.pdf');

    pdfDoc
      .pipe(file.createWriteStream())
      .on('finish', () => {
        console.log('PDFの作成完了');
        res.status(200).send('pdf create completed.');
      })
      .on('error', () => {
        console.log('PDFの作成失敗');
        res.status(500).send('pdf create failed.');
      });

    pdfDoc.end();
  });

export const createdPdfStorageHandler = functions
  .region('asia-northeast1')
  .storage.object()
  .onFinalize(async (metadata, context) => {
    const client = new v2beta3.CloudTasksClient();
    const project = process.env.GCLOUD_PROJECT as string;
    const parent = client.queuePath(
      project,
      'asia-northeast1',
      'receive-pdf-queue'
    );
    const payload = {
      bucket: metadata.bucket,
      id: metadata.id,
      name: metadata.name,
      selfLink: metadata.owner,
      mediaLink: metadata.mediaLink,
    };

    const convertedPayload = JSON.stringify(payload);
    const body = Buffer.from(convertedPayload).toString('base64');
    const task = {
      appEngineHttpRequest: {
        httpMethod: 1,
        relativeUri: '/receive-pdf',
        body,
      },
    };

    const response = await client.createTask({ parent, task });
    const responseName = response[0].name ? response[0].name : '';
    console.log(`Created task ${responseName}`);
  });
