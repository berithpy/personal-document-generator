const createPdf = require('./renderer');

const invoiceNumber = 123
const invoiceDate = "January 1, 2019"
const invoiceDueDate = "February 1, 2019"
const sender = "Placeholder SRL"
const senderAddress = "12345 Placeholder Road"
const senderCity = "Placeholder, DC 12345"
const senderEmail = "mike@sender.com"

const senderPicture = "http://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png"
const recipient = "Acme Corp."
const recipientEmail = "john@example.com"
const recipientAddress = "Evergreen 12345"
const recipientCity = "Greenbow alabama"
const itemList = [{description:"Website desing",price:300.00},{description:"Hosting (3 months)",price:75.50},{description:"Domain name(1 year)",price:10.00}]

let itemTotal = 0
itemList.forEach(item => {
  itemTotal += item.price
  item.price = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)
})

itemTotal = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(itemTotal)
const pdfData = {
  invoiceNumber: invoiceNumber,
  invoiceDate: invoiceDate,
  invoiceDueDate: invoiceDueDate,
  senderPicture: senderPicture,
  recipient: recipient,
  recipientAddress: recipientAddress,
  recipientCity: recipientCity,
  recipientEmail: recipientEmail,
  sender: sender,
  senderAddress: senderAddress,
  senderEmail: senderEmail,
  senderCity: senderCity,
  itemList: itemList,
  itemTotal: itemTotal
}
const filename = 'example_invoice.pdf'
createPdf(pdfData, filename, "template/invoice.pug");