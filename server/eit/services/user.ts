import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { JwtVariables } from 'hono/jwt';
import userModel from '../models/user';

type jwtPayload = {
  userId: string;
  role: 'admin' | 'user';
  exp: number;
};

type Variables = JwtVariables<jwtPayload>;

const user = new Hono<{ Variables: Variables }>();

user.delete('/:userId', async (c) => {
  const jwtPayload = c.get('jwtPayload');

  if (jwtPayload.role !== 'admin') {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  const userId = c.req.param('userId');

  const user = await userModel.findById(userId);

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  await userModel.findByIdAndDelete(userId);

  return c.body(null, 204);
});

export default user;
