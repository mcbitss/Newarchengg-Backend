export function contactUsTemplate(data) {
  return `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>mAbTree</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");
      body {
        font-family: "Inter", sans-serif;
        padding: 20px;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin-top: 0;
        margin-bottom: 0;
      }
    </style>
  </head>

  <body style="margin:0;">
    <div>
      <table style="background:#f2f2f2;width:100%;border-top:10px solid #f2f2f2">
        <tbody>
            <tr>
                <td valign="top" align="center">
                  <br /><br />
                  <div class="content">                
                      <div class="title">Dear <span style="font-weight: 600;">${data.name}</span>,</div><br />
                      <div class="title">Thank you for reaching out to us.</div>
                      <div class="title">we have received your message. one of our team member will get in touch with you shortly.</div>
                      <br /><br />
                      <div class="title"><b>Your query</b></div>
                      <div class="title">${data.message}</div>
                      <br /><br />
                      <div class="title">Thanks</div>
                      <div class="title">newarchengg</div>
                      <br /><br />
                  </div>
                </td>
            </tr>
        </tbody>
      </table>
    </div>
  </body>
</html> `;
}
