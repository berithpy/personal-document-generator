const puppeteer = require("puppeteer");
const pug = require("pug");
const fs = require('fs');

const renderPdf = async function (html) {
  const content = html
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setContent(content)
  const buffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      left: '0px',
      top: '0px',
      right: '0px',
      bottom: '0px'
    }
  })
  await browser.close()
  return buffer
}

const createPdf = async function (data, pdfFilePath = "invoice.pdf",template = "template/invoice.pug") {
  // Compile the source code
  const compiledFunction = pug.compileFile(template);
  let html = compiledFunction(data);

  // Render a set of data
  buffer = await renderPdf(html)

  //chage this to where you want to create the file.
  fs.writeFile(pdfFilePath, buffer, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log(`The pdf was saved at ${pdfFilePath}`);
  });
}
module.exports = createPdf