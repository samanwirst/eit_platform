import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { JwtVariables } from 'hono/jwt';
import keyModel from '../models/key';
import userModel from '../models/user';
import testModel from '../models/test';

type jwtPayload = {
  userId: string;
  role: 'admin' | 'user';
  exp: number;
};

type Variables = JwtVariables<jwtPayload>;

const keys = new Hono<{ Variables: Variables }>();

function generateReadableKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  let key = '';
  for (let i = 0; i < 6; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  key += nums.charAt(Math.floor(Math.random() * nums.length));
  key += nums.charAt(Math.floor(Math.random() * nums.length));
  return key
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

keys.post('/', async (c) => {
  const jwtPayload = c.get('jwtPayload');

  if (jwtPayload.role !== 'admin') {
    throw new HTTPException(403, { message: 'Forbidden' });
  }
  const { userId, testId } = await c.req.json();

  const user = await userModel.findById(userId);

  if (!user) {
    throw new HTTPException(400, { message: 'User not found' });
  }
  const test = await testModel.findById(testId);

  if (!test) {
    throw new HTTPException(400, { message: 'Test not found' });
  }
  const key = generateReadableKey();

  await keyModel.create({ key, user: userId, test: testId });

  return c.json({ ok: true, key }, 201);
});

export default keys;
