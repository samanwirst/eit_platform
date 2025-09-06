import { Hono } from 'hono';
import { validator } from 'hono/validator';
import type { JwtVariables } from 'hono/jwt';
import { HTTPException } from 'hono/http-exception';
import * as z from 'zod';
import userModel from '../models/user';

type jwtPayload = {
  userId: string;
  role: 'admin' | 'user';
  exp: number;
};

type Variables = JwtVariables<jwtPayload>;

const users = new Hono<{ Variables: Variables }>();

const rootedCast = z.object({
  firstName: z.string().regex(/^[a-zA-Z]+$/),
  lastName: z.string().regex(/^[a-zA-Z]+$/),
  phoneNumber: z.string().regex(/^\d+$/),
  password: z
    .string()
    .min(8)
    .max(32)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/),
  role: z.enum(['admin', 'user']).default('user'),
});

users.get('/', async (c) => {
  const jwtPayload = c.get('jwtPayload');

  if (jwtPayload.role !== 'admin') {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  const users = await userModel.find().select('-__v -password');

  return c.json({ ok: true, users });
});

users.post(
  '/',
  validator('json', (value) => {
    const parsed = rootedCast.safeParse(value);

    if (!parsed.success) {
      throw new HTTPException(400, { message: 'Bad Request' });
    }

    return parsed.data;
  }),
  async (c) => {
    const jwtPayload = c.get('jwtPayload');

    if (jwtPayload.role !== 'admin') {
      throw new HTTPException(403, { message: 'Forbidden' });
    }

    const { firstName, lastName, phoneNumber, password, role } = c.req.valid('json');

    const user = await userModel.findOne({ phoneNumber });

    if (user) {
      throw new HTTPException(400, { message: 'Bad Request' });
    }

    await userModel.create({
      firstName,
      lastName,
      phoneNumber,
      password: await Bun.password.hash(password),
      role,
    });

    return c.json({ ok: true, message: 'Created' }, 201);
  }
);

export default users;
