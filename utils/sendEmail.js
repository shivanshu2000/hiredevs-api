import sendgrid from '@sendgrid/mail';
export const sendEmail = ({ to, from, subject, text, html }) => {
  console.log('here: ', process.env.SENDGRID_API_KEY);
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = { to, from, subject, text, html };

  return sendgrid.send(msg);
};
