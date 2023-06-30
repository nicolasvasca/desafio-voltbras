import { hashSync } from 'bcrypt';

export const hashPasswordTransform = {
  to(password: string): string {
    return hashSync(password, Number(process.env.SALT));
  },
  from(hash: string): string {
    return hash;
  },
};
