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
        }


    }


    const sendPasswordResetEmail = async(email, resetUrl)=>{
        try {
            const mailOptions = {
              from: `Basnet Realties <${process.env.EMAIL_USER}>`,
              to: email,
              subject: 'Reset Your Password',
              html: `Click <a href="${resetUrl}">here</a> to reset your password`
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
      text: `Your booking has been ${status}`
    };
    await transporter.sendMail(mailOptions);
    console.log("Booking status has been changed");




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