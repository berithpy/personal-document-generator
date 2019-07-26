const createPdf = require('./renderer');
const parser = require('cron-parser');
const moment = require('moment');
const firebase = require('firebase');
require("firebase/firestore");
const fbCreds = require('./firebaseCredentials')
const dataConfig = require('./dataConfig')
firebase.initializeApp(fbCreds);
const db = firebase.firestore();
const collection = dataConfig.collection
const client = dataConfig.client
const docRef = db.collection(collection).doc(client);

const localeOptions = { year: 'numeric', month: 'long', day: 'numeric' }

docRef.get().then(function (doc) {
  if (doc.exists) {
    console.log(`Using document ${dataConfig.collection}`);
    const dbData = doc.data()
    const invoiceNumber = dbData.invoiceNumber;
    const invoiceDate = new Date().toLocaleDateString('en-US', localeOptions);
    const cronDueDate = dbData.cronDueDate;
    let interval = parser.parseExpression(cronDueDate);
    const invoiceDueDate = interval.next().toDate().toLocaleDateString('en-US', localeOptions);

    let itemTotal = 0
    dbData.itemList.forEach(item => {
      itemTotal += item.price
      item.price = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)
    })
    
    itemTotal = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(itemTotal)
    const pdfData = {
      invoiceNumber: invoiceNumber,
      invoiceDate: invoiceDate,
      invoiceDueDate: invoiceDueDate,
      senderPicture: dbData.senderPicture,
      recipient: dbData.recipient,
      recipientAddress: dbData.recipientAddress,
      recipientCity: dbData.recipientCity,
      recipientEmail: dbData.recipientEmail,
      sender: dbData.sender,
      senderAddress: dbData.senderAddress,
      senderEmail: dbData.senderEmail,
      senderCity: dbData.senderCity,
      itemList: dbData.itemList,
      itemTotal: itemTotal
    }
    const filename = `ddiaz${moment().format('YMM')}.pdf`
    createPdf(pdfData, filename, "template/invoice.pug");
  } else {
    // doc.data() will be undefined in this case
    console.log(`No such document ${dataConfig.collection}!`);
  }
}).catch(function (error) {
  console.log("Error getting document:", error);
});
