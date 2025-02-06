const {resend} =require('./config.js');
const {verificationTokenEmailTemplate} = require('./email-template.js');    
const {welcome_email_template}= require('../Resend/email-template.js');

const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Verify Your Email",
            html: verificationTokenEmailTemplate.replace("{verificationToken}",verificationToken),
        });

        if (error) {
            console.error(`Failed to send email: ${error.message}`, error);
            throw new Error('Email sending failed');
        }
        console.log('Email sent successfully:', data);
    } catch (err) {
        console.error(`Error in sendVerificationEmail: ${err.message}`, err);
    }
};

const sendWelcomeEmail = async(email,name)=>{
    try{

        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Welcome to Basnet Realties",
            html: welcome_email_template.replace("{name}",name),
        });
        if(error){
            console.error(`Error: ${error.message}`);
        }


    }catch(error){
        console.error(`Error in sendWelcomeEmail: ${error.message}`, error);

    }
}


const sendPasswordResetEmail= async (email, resetUrl)=>{

    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Reset Your Password",
            html:`Click <a href="${resetUrl}"> here</a> to reset your password`,
        });

        if (error) {
            console.error(`Failed to send email: ${error.message}`, error);
            throw new Error('Email sending failed');
        }
        console.log('Email sent successfully:', data);
    } catch (err) {
        console.error(`Error in sendPasswordResetEmail: ${err.message}`, err);
    }   
}

const sendResetSuccessEmail= async(email)=>{

    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Password changed successfully",
            html:`Password changed successfully`,
        });

        if (error) {
            console.error(`Failed to send email: ${error.message}`, error);
            throw new Error('Email sending failed');
        }
        console.log('Email sent successfully:', data);
    } catch (err) {
        console.error(`Error in sendPasswordSuccessEmail: ${err.message}`, err);
    }   


}

module.exports={sendVerificationEmail, 
                sendWelcomeEmail, 
                sendPasswordResetEmail,
                sendResetSuccessEmail
            };