const nodemailer = require('nodemailer');
const { verificationTokenEmailTemplate, welcome_email_template } = require('./email-template');



const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})



    const sendVerificationEmail = async(email, verificationToken)=>{
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            const error = new Error("Verification email is not configured. Set EMAIL_USER and EMAIL_PASSWORD in server/.env.");
            error.code = "EMAIL_NOT_CONFIGURED";
            throw error;
        }

        try{
            const mailOptions ={
                from: `"Basnet Realties" <${process.env.EMAIL_USER}>` ,
                to: email,
                subject: "verify Your email",
                html : verificationTokenEmailTemplate.replace("{verificationToken}", verificationToken) 
            };
            await transporter.sendMail(mailOptions);
            console.log("Verifcation email sesnt");
        }catch(error){
            console.log("verification error", error);
            throw error;
        }


    }


    const sendPasswordResetEmail = async(email, resetUrl)=>{
        try {
            const mailOptions = {
              from: `Basnet Realties <${process.env.EMAIL_USER}>`,
              to: email,
              subject: 'Reset Your Password',
              text: `Reset your password using this link: ${resetUrl}`,
              html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">Reset your password</a></p><p>If the button does not work, copy and paste this URL into your browser:</p><p>${resetUrl}</p>`
            };
        
            await transporter.sendMail(mailOptions);
            console.log('Password reset email sent');
          } catch (err) {
            console.error('Error sending password reset email:', err);
            throw new Error('Failed to send password reset email');
          }
    }


const sendResetSuccessEmail = async(email)=>{
    try {
        const mailOptions = {
          from: `Basnet Realties <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Password Changed Successfully',
          text: 'Your password has been changed successfully'
        };
    
        await transporter.sendMail(mailOptions);
        console.log('Password change confirmation sent');
      } catch (err) {
        console.error('Error sending password change confirmation:', err);
        throw new Error('Failed to send password change confirmation');
      }
}


const sendWelcomeEmail = async(email, name)=>{

    try {
        const mailOptions = {
          from: `Basnet Realties <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Welcome to Basnet Realties',
          html: welcome_email_template.replace("{name}", name)
        };
    
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent');
      } catch (err) {
        console.error('Error sending welcome email:', err);
        throw new Error('Failed to send welcome email');
      }

}


const sendBookingConfirmation = async(email, status)=>{


  try{
    const mailOptions ={
      from : `Basnet Realties <${process.env.EMAIL_USER}>`,
      to: email,
      subject : `Appointment Booking`,
      text: `Your Appointment has been ${status}. Please remember your date.\n\nThank you,\nBasnet Realties`
    };
    await transporter.sendMail(mailOptions);
    console.log("Booking status has been changed");
        console.log(`Email sent to ${email}`);

  }catch(error){
    console.error('Error :', error);

  }
}







module.exports={
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail,
    sendWelcomeEmail,
    sendBookingConfirmation

};