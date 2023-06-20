import nodeMailer, { Transporter } from "nodemailer";
import { MailOption, NodemailerOption } from '../interfaces/nodemailer.interface';

export const sendMail = async (options: NodemailerOption) => {
    const transport: Transporter = nodeMailer.createTransport({
        host: process.env.MAILRE_HOST,
        port: parseInt(process.env.MAILRE_PORT as string), // if secure false port = 587, if true port= 465
        secure: true,
        // service: "smtp.gmail.com",
        auth: {
            user: process.env.MAILRE_USER as string,
            pass: process.env.MAILRE_PASS as string
        },

    });

    const emailOpt: MailOption = {
        from: "Social Network Team",
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transport.sendMail(emailOpt);
}