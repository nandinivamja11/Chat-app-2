const resend = require("../config/resend");

const sendOTP = async (email, otp) => {
  try {
    const data = await resend.emails.send({
      // from: "your App <onboarding@resend.dev>",
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: ${otp}</h2>`,
    });

    console.log("Email sent:", data);
    return data;

  } catch (err) {
    console.log("EMAIL ERROR:", err);
  }
};

module.exports = sendOTP;