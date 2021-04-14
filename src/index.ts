import PdfPrinter from "pdfmake";
import fs from "fs";

const printer = new PdfPrinter({
  IpaExg: {
    normal: "fonts/ipaexg.ttf",
    bold: "fonts/ipaexg.ttf",
    italics: "fonts/ipaexg.ttf",
    bolditalics: "fonts/ipaexg.ttf",
  },
});

const dd = {
  content: [
    {
      layout: "lightHorizontalLines", // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [
          "*",
          "auto",
          100,
          "*",
          "*",
          "auto",
          100,
          "*",
          "*",
          "auto",
          100,
          "*",
          "*",
          "auto",
          100,
          "*",
          "*",
        ],

        body: [
          [
            "First",
            "Second",
            "Third",
            "The last one",
            "The last one",
            "Second",
            "Third",
            "The last one",
            "The last one",
            "Second",
            "Third",
            "The last one",
            "The last one",
            "Second",
            "Third",
            "The last one",
            "The last one",
          ],
          [
            "Value 1",
            "Value 2",
            "Value 3",
            "Value 4",
            "The last one",
            "Value 2",
            "Value 3",
            "Value 4",
            "The last one",
            "Value 2",
            "Value 3",
            "Value 4",
            "The last one",
            "Value 2",
            "Value 3",
            "Value 4",
            "The last one",
          ],
        ],
      },
    },
  ],
  defaultStyle: {
    font: "IpaExg",
  },
};

const pdfDoc = printer.createPdfKitDocument(dd);
pdfDoc.pipe(fs.createWriteStream("sample.pdf"));
pdfDoc.end();
