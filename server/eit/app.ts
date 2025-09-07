import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import mongoose from 'mongoose';
import login from './services/login';
import users from './services/users';
import tests from './services/tests';
import keys from './services/keys';
import accessTest from './services/access-test';
import user from './services/user';
import test from './services/test';

const app = new Hono();

declare module 'bun' {
  interface Env {
    PORT: number;
    MONGO_URI: string;
    JWT_SECRET: string;
  }
}

app.notFound((c) => {
  return c.json({ ok: false, message: 'Not Found' }, 404);
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    if (err.status === 401) {
      return c.json({ ok: false, message: 'Unauthorized' }, 401);
    }

    return c.json({ ok: false, message: err.message }, err.status);
  }

  return c.json({ ok: false, message: 'Internal Server Error' }, 500);
});

app.use('*', cors({ origin: '*', allowHeaders: ['*'], allowMethods: ['*'] }));

app.get('/uploads/:filename', async (c) => {
  const filename = c.req.param('filename');
  const filePath = `./uploads/${filename}`;
  const file = Bun.file(filePath);
  if (await file.exists()) {
    //@ts-ignore
    return c.body(file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  }
  return c.json({ ok: false, message: 'File not found' }, 404);
});

app.use('/users/*', jwt({ secret: Bun.env.JWT_SECRET }));
app.use('/test/*', jwt({ secret: Bun.env.JWT_SECRET }));
app.use('/tests/*', jwt({ secret: Bun.env.JWT_SECRET }));
app.use('/keys/*', jwt({ secret: Bun.env.JWT_SECRET }));
app.use('/access-test/*', jwt({ secret: Bun.env.JWT_SECRET }));
app.use('/user/*', jwt({ secret: Bun.env.JWT_SECRET }));

app.route('/login', login);
app.route('/users', users);
app.route('/tests', tests);
app.route('/keys', keys);
app.route('/access-test', accessTest);
app.route('/user', user);
app.route('/test', test);

async function main() {
  try {
    await mongoose.connect(Bun.env.MONGO_URI);

    Bun.serve({ port: Bun.env.PORT, fetch: app.fetch });

    console.log('Started!');
  } catch (err) {
    console.error(err);
  }
}

main();
