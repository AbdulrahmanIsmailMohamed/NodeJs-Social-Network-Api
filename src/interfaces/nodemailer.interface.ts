export interface NodemailerOption {
    email: string,
    subject: string,
    message: string
}

export interface MailOption {
    from: string,
    to: NodemailerOption["email"],
    subject: NodemailerOption["subject"],
    html: NodemailerOption["email"],

}