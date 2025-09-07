import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { validator } from 'hono/validator';
import { HTTPException } from 'hono/http-exception';
import * as z from 'zod';
import userModel from '../models/user';

const login = new Hono();

const cageyHat = z.object({
  phoneNumber: z.string().regex(/^\d+$/),
  password: z
    .string()
    .min(8)
    .max(32)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/),
});

login.post(
  '/',
  validator('json', (value) => {
    const parsed = cageyHat.safeParse(value);

    if (!parsed.success) {
      throw new HTTPException(400, { message: 'Bad Request' });
    }

    return parsed.data;
  }),
  async (c) => {
    const { phoneNumber, password } = c.req.valid('json');

    const user = await userModel.findOne({ phoneNumber });

    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    if (!(await Bun.password.verify(password, user.password))) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    const token = await sign(
      {
        userId: user.id,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 86400,
      },
      Bun.env.JWT_SECRET
    );

    return c.json({ ok: true, token: token });
  }
);

export default login;
