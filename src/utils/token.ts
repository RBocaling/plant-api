import jwt from 'jsonwebtoken';

export const generateAccessToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET! || "129824517bc2ed986478fd56fd2c05cca8f586903ba3642d511b4b0b0ac017ae", { expiresIn: '7d' }); 
};

export const generateRefreshToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET! || "2f29f6ee20e04437106e7a44e65ecf79963043de4c79fa47d29486d8ff9ad5e4", { expiresIn: '7d' }); 
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
};
