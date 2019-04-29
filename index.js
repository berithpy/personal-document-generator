const puppeteer = require("puppeteer");
const pug = require("pug");
const fs = require('fs');

// This data should be set by a db or manually set everytime.
const invoiceNumber = 124
const invoiceDate = "January 1, 2019"
const invoiceDueDate = "February 1, 2019"
const senderPicture = "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.jpg"
const sender = "Placeholder SRL"
const senderAddress = "12345 Placeholder Road"
const senderCity = "Placeholder, DC 12345"
const recipient = "Acme Corp."
const recipientName = "John Doe"
const recipientEmail = "john@example.com"
const itemList = [
  { description: "Professional Software development services", price: 0 },
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
  sender: sender,
  senderAddress: senderAddress,
  senderCity: senderCity,
  recipient: recipient,
  recipientName: recipientName,
  recipientEmail: recipientEmail,
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