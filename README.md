# personal-document-generator
Node, pug template based document generator with firebase as the database.

This js project is split on two parts for easier repurposing, the important `renderer.js` and the actual document generators, one of them is`invoice.js`.

The renderer is in charge of *actually* rendering the pdf from a pug template, it exports a `createPdf` function to which you can feed it a `data` object, a desired path `pdfFilePath` to export the pdf to and a pug `template` path.  
The invoice file gets data from firebase and uses the renderer to create my invoice.  
The appearance of the documents generated are defined on the pug templates and on the css.  
If you don't care about having it on a database you can edit `example_invoice.js`, that one doesn't rely on any external services.

## TODO
Record "printed" invoices on firebase