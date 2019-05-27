const createPdf = require('./renderer');
const parser = require('cron-parser');
const firebase = require('firebase');
require("firebase/firestore");
const fbCreds = require('./firebaseCredentials')

firebase.initializeApp(fbCreds);

const db = firebase.firestore();
const docRef = db.collection("invoice-data").doc("client");
docRef.get().then(function (doc) {
  if (doc.exists) {
    console.log("Document data:", doc.data());
    const localeOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    const invoiceNumber = 192
    const invoiceDate = new Date().toLocaleDateString('en-US', localeOptions)
    const cronDueDate = "0 0 1 * *"
    let interval = parser.parseExpression(cronDueDate)
    const invoiceDueDate = interval.next().toDate().toLocaleDateString('en-US', localeOptions)

    let itemTotal = 0
    itemList.forEach(item => {
      itemTotal += item.price
      item.price = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)
    })
    itemTotal = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(itemTotal)
    const data = {
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

    createPdf(data);
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}).catch(function (error) {
  console.log("Error getting document:", error);
});
