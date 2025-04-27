const nodemailer = require('nodemailer');

// 1. Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // <-- Brevo SMTP host
  port: 587,                    // <-- Brevo recommended port
  auth: {
    user: 'farewellvit25@gmail.com', // <-- your Brevo account email
    pass: 'ruyhbudabyrjnnbj'       // <-- your Brevo SMTP password (not login password)
  }
});

// 2. Send email function
const sendEmail = (to, otp) => {
  const mailOptions = {
    from: 'farewellvit25@example.com', // <-- your Brevo verified email
    to: to,
    subject: 'Your WorkerDB Registration OTP',
    text: `Your OTP code is: ${otp}`
  };

  return transporter.sendMail(mailOptions);
};
exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  // 1. Verify OTP (if you are saving it somewhere)

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  user.isVerified = true;
  await user.save();

  res.send({ message: "Email verified successfully!" });
};

module.exports = sendEmail;
