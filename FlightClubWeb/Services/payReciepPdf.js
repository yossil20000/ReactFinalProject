const { jsPDF } = require("jspdf"); // will automatically load the node version
require('../Types/date.extensions')
require('jspdf-autotable');
const path = require('path');
const {dirname} = require('path');
const appDir = dirname(require.main.filename);
const savedFile = path.join(appDir, "recipe.pdf")
const mail = require("../Services/mailService");
exports.send_recipe = async function (email, transaction) {
  const doc = new jsPDF();
  try {

    doc.addFont('public/fonts/VarelaRound-Regular.TTF', "VarelaRound", "Regular")
    /* doc.setFont("VarelaRound", "Regular") */
    /* doc.setR2L(true) */
    const ref = JSON.parse(transaction?.payment?.referance)
    let row = 0;
    const nextRow = () => {row = row + 10; return row}
    doc.text(`BAZ Club Recipe`,50,nextRow());
    row = 20;
    doc.text(`R.A : ${ref.companyId}`,0,nextRow());
    doc.text(`Phone : ${ref.phone}`,0,nextRow());
    doc.text(`Email : ${ref.email}`,0,nextRow());
    row = 20;
    doc.text(`Recipe : ${ref.reciepeId}`,100,nextRow());
    doc.text(`Date : ${new Date().getDisplayDate()}`,100,nextRow());
    
    doc.autoTable({
      startY: nextRow() + 10,
      header: "cxxx",
      columnStyles: { amount: { halign: 'center' } }, // European countries centered
      body: [
        {
          by: transaction?.payment?.method,
          account: ref?.accountId,
          bank: ref?.bank,
          branch: ref?.branch,
          ref: ref?.referance,
          date: new Date(ref?.date).getDisplayDate(),
          amount: transaction.amount
        },
        {  date: "Total",amount: transaction?.amount},
        {  date: "Tax",amount: 0},
        {  date: "Total Befor",amount: transaction?.amount},
      ],
      columns: [
        { header: 'Pay by', dataKey: 'by' },
        { header: 'Account No', dataKey: 'account' },
        { header: 'Bank', dataKey: 'bank' },
        { header: 'Branch', dataKey: 'branch' },
        { header: 'Ref', dataKey: 'ref' },
        { header: 'Date', dataKey: 'date' },
        { header: 'Amount', dataKey: 'amount' }
      ],

    });
    row = doc.lastAutoTable.finalY + 10
    doc.text(`Description : ${ref.description}`,0,nextRow());
    doc.save(savedFile); // will save the file in the current working directory
    await mail.SendMailRecipe(email, "Payment Recipe", "a4.pdf",savedFile)
                                    
  }
  catch (err) {
    console.error('send_recipe', err)
  }
}