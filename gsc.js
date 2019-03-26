var GoogleSpreadsheet = require("google-spreadsheet");
var creds = {
  client_email: process.env.GCS_EMAIL,
  private_key: process.env.GCS_PRIVATE_KEY.replace(/\\n/g, '\n')
}
console.log(creds);

const sheetId = "1E--ADFQ16rbHPfF_wzOj_1IelS9DCmbce3_Xmvzcgkw";

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet(sheetId);

// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function(err) {
  console.log(err);
  // Get all of the rows from the spreadsheet.
  doc.getInfo(function(err, info) {
    // console.log("Loaded doc: " + info.title + " by " + info.author.email);
    var sheet = info.worksheets[0];
    // console.log(
    //   "sheet 1: " + sheet.title + " " + sheet.rowCount + "x" + sheet.colCount
    // );
    // console.log(sheet);
    // sheet.getRows({
    //   offset: 1,
    //   limit: 20,
    // },
    //   function(err, rows) {
    //     console.log("getRows");
    //     console.log(rows[0]);
    //     console.log(rows[0].colname);
    //   }
    // );

    sheet.addRow({
      date: new Date().toDateString(),
      nsw: "nsw value",
      vg: "nsw value",
    }, function(err, res){
      console.log("addRow");
      console.log(err);
      console.log(res);
    })
  });

  // doc.getInfo(function(err, info) {
  //   console.log("getInfo");
  //   console.log(err);
  //   console.log(info);
  //   // console.log('Loaded doc: '+info.title+' by '+info.author.email);
  //   // sheet = info.worksheets[0];
  //   // console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
  // });
});
