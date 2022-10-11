const createPdf = require('./renderer');

const invoiceNumber = 2209 
const filename = `${invoiceNumber}_JOHNDOE.pdf`

const invoiceDate = "September 1, 2022"
const invoiceDueDate = "September 10, 2022"
const sender = "JOHN DOE"
const senderAddress = "Fake Street 123"
const senderCity = "Fake City, Fake Country"
const senderEmail = "FakeEmail@gmail.com"

const senderPicture = "http://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png"
const recipient = "fakecompany"
const recipientEmail = "accounting@fakecompany.com"
const recipientAddress = "Evergreen 21021"
const recipientCity = "Jamaica, NY 11432"
const itemList = [{description:"Professional software developement services",price:10000.00},{description:"Hosting",price:300.00}]
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
createPdf(pdfData, filename, "template/invoice.pug");