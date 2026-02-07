export function generateOtp(length: number = 4): string {
  const digits = "123456789"; 
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
}
