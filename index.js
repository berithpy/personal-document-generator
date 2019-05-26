const puppeteer = require("puppeteer");
const pug = require("pug");
const fs = require('fs');
const parser = require('cron-parser');

// This data should be set by a db or manually set everytime.
const invoiceNumber = 192
const invoiceDate = "April 29, 2019"
const cronDueDate = "0 0 1 * *"
let interval = parser.parseExpression(cronDueDate)
const invoiceDueDate = interval.next().toDate().toLocaleDateString('en-US',{weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})

const senderPicture = "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.jpg"

const recipient = "Jon inc"
const recipientAddress = "4198  Neuport Lane"
const recipientCity = "Bremen, Maine 04551"
const recipientEmail = "joninc@fakeemail.com"

const sender = "Laverne K Toner"
const senderAddress = "3396  Angus Road"
const senderCity = "New York, New York 10048"
const senderEmail = "laverne@fakeemail.com"

const itemList = [
  { description: "Cooking services", price: 40.76 },
  { description: "Entretainment services", price: 29.76 },
]
let itemTotal=0
itemList.forEach(item=>{
  itemTotal+=item.price
  item.price = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)
})
itemTotal=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(itemTotal)
console.log(itemTotal)
const data = {
  invoiceNumber: invoiceNumber,
  invoiceDate: invoiceDate,
  invoiceDueDate: invoiceDueDate,
  senderPicture: senderPicture,
  recipient: recipient,
  recipientAddress: recipientAddress,
  recipientCity: recipientCity,
  recipientEmail:recipientEmail,
  sender: sender,
  senderAddress: senderAddress,
  senderEmail: senderEmail,
  senderCity: senderCity,
  itemList: itemList,
  itemTotal: itemTotal
}

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

const createPdf = async function (data,pdfFilePath="invoice.pdf") {
  // Compile the source code
  const compiledFunction = pug.compileFile("template/invoice.pug");
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

createPdf(data);