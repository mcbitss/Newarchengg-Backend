import axios from "axios";
import nodemailer from "nodemailer";
import {
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
  AZURE_TENANT_ID,
  CONTACT_US_MAILS,
  GRAPH_SENDER,
  MAIL_ADDRESS,
  MAIL_AUTH,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_SECURE
} from "../../config";
import { translateText } from "../Util/Util";
import { contactUsTemplate } from "./contactUsTemplate";

const GRAPH_SCOPE = "https://graph.microsoft.com/.default";
const GRAPH_TOKEN_TTL_BUFFER_MS = 5 * 60 * 1000;

const authMode = () => String(MAIL_AUTH || "").toLowerCase();
const isGraph = () => authMode() === "graph";

const senderAddress = () => GRAPH_SENDER || MAIL_ADDRESS;

const FROM = (mailData) => `"${mailData?.companyName || "mAbTree"}" <${senderAddress()}>`;

const parseAddress = (from = "") => {
  const match = /<([^>]+)>/.exec(from);
  return match ? match[1].trim() : from.trim();
};

const parseName = (from = "") => {
  const match = /^\s*"?([^"<]*?)"?\s*</.exec(from);
  return match ? match[1].trim() : "";
};

const toRecipientList = (value) => {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : String(value).split(",");
  return raw.map((item) => String(item).trim()).filter(Boolean);
};

const toGraphRecipients = (value) => toRecipientList(value).map((address) => ({ emailAddress: { address } }));

let cachedGraphToken = null;

const getGraphAccessToken = async () => {
  const now = Date.now();
  if (cachedGraphToken && now < cachedGraphToken.exp - GRAPH_TOKEN_TTL_BUFFER_MS) {
    return cachedGraphToken.token;
  }

  if (!AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET) {
    throw new Error("Graph mail requires AZURE_TENANT_ID, AZURE_CLIENT_ID and AZURE_CLIENT_SECRET.");
  }

  const url = `https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: AZURE_CLIENT_ID,
    client_secret: AZURE_CLIENT_SECRET,
    scope: GRAPH_SCOPE,
    grant_type: "client_credentials"
  });

  const { data } = await axios.post(url, body.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  if (!data?.access_token) {
    throw new Error(data?.error_description || data?.error || "OAuth token request failed");
  }

  cachedGraphToken = {
    token: data.access_token,
    exp: now + (Number(data.expires_in) || 3600) * 1000
  };

  return cachedGraphToken.token;
};

const sendViaGraph = async (message) => {
  const token = await getGraphAccessToken();
  const sender = GRAPH_SENDER || MAIL_ADDRESS || parseAddress(message.from);

  if (!sender) {
    throw new Error("Graph mode requires a sending mailbox (set GRAPH_SENDER).");
  }

  const graphMessage = {
    subject: message.subject || "",
    body: {
      contentType: message.html ? "HTML" : "Text",
      content: message.html || message.text || ""
    },
    toRecipients: toGraphRecipients(message.to),
    from: {
      emailAddress: {
        address: sender,
        name: parseName(message.from) || undefined
      }
    }
  };

  const cc = toGraphRecipients(message.cc);
  if (cc.length) {
    graphMessage.ccRecipients = cc;
  }

  await axios.post(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`,
    { message: graphMessage, saveToSentItems: false },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return {
    accepted: toRecipientList(message.to),
    rejected: []
  };
};

const getSmtpTransporter = () =>
  nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secureConnection: MAIL_SECURE,
    auth: {
      user: MAIL_ADDRESS,
      pass: MAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

const sendMail = async (message) => {
  if (isGraph()) {
    return sendViaGraph(message);
  }

  return getSmtpTransporter().sendMail(message);
};

const emailError = (err, data) => {
  const detail = err?.response?.data || err?.response?.body || err?.message || err;
  console.log(`Email error for ${data.email} :`, detail);
};

const emailSuccess = (data) => {
  console.log(`Email sent to ${data.email}`);
};

export const contactUsEmail = (mailData) => {
  const message = {
    from: FROM(mailData),
    to: mailData.email,
    cc: toRecipientList(CONTACT_US_MAILS),
    subject: translateText("Contact us", mailData.language),
    html: contactUsTemplate(mailData)
  };

  sendMail(message)
    .then(() => emailSuccess(mailData))
    .catch((error) => emailError(error, mailData));
};
