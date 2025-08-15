require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOrderNotification(order) {
  const totalNumber = Number(order.total);

  const message = `
Novo pedido recebido!

Nome: ${order.nome}
Contato: ${order.contato}
Endereço: ${order.rua}, ${order.numero}, ${order.bairro}, CEP: ${order.cep}
Pagamento: ${order.pagamento}
Total: R$ ${isNaN(totalNumber) ? order.total : totalNumber.toFixed(2)}

Produtos:
${
  Array.isArray(order.produtos)
    ? order.produtos.map((livro) => `- ${livro.title || livro}`).join("\n")
    : "Nenhum produto"
}
`;

  const mailOptions = {
    from: `"BookBay Pedidos" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL || process.env.EMAIL_USER,
    subject: "📦 Novo Pedido Realizado",
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Notificação de pedido enviada com sucesso.");
  } catch (err) {
    console.error("Erro ao enviar notificação de pedido:", err);
  }
}

module.exports = { sendOrderNotification };
