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
