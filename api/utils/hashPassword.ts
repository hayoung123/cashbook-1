import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRound: number = +(process.env.HASH_SALT_ROUND || 1);

  const salt = await bcrypt.genSalt(saltRound);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

export default hashPassword;
