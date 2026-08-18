export const header = (
  label,
  description
) => `<table width="640" margin-top: 30px; cellpadding="0" cellspacing="0" border="0" bgcolor="#210070">
    <tr>
        <td height="20" style="font-size:10px; line-height:10px;"> </td>
    </tr>
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                <tr>
                    <td height="60" style="font-size:10px; line-height:10px;"> </td>
                </tr>
                <tr>
                    <td width="600" style="font-family:Open Sans; font-size:12px; line-height:18px;"
                        align="center">
                        <table width="500" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td width="500" style="font-family: Open Sans; text-align: center; color: #fff; font-size: 40px; text-transform: capitalize; line-height: 150%; font-weight: bolder;" align="left">
                                    ${label}
                                </td>
                            </tr>
                            <tr>
                                <td height="10" style="font-size:10px; line-height:10px;"> </td>
                            </tr>
                            <tr>
                                <td width="500" style="font-family: Open Sans; text-align: center; color: #fff; font-size: 20px; text-transform: capitalize; line-height: 150%; font-weight: light;" align="left">
                                    ${description}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td height="60" style="font-size:10px; line-height:10px;"> </td>
                </tr>
            </table>

        </td>
    </tr>
</table>`;

export const footer =
  () => `<table width="640" cellpadding="0" cellspacing="0" border="0" bgcolor="transparent">
    <tr>
        <td height="20" style="font-size:10px; line-height:10px;"> </td>
    </tr>
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                <tr>
                    <td width="600" style=" font-size:14px; line-height: 161%; color:#63778c;" align="center">
                        Your're receiving this email because your orgainsation has an account in
                        Accounting. If you are not
                        sure why you're receiving this, please contact us.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td height="40" style="font-size:10px; line-height:10px;"> </td>
    </tr>
</table>`;

export const button = (label, link) => `<a href="${link}"
    style="text-decoration: none; padding: 10px 21px; border-radius: 4px; background-color: #ff9800; color: #fff; font-weight: bold; font-size: 16px;">${label}</a>`;
