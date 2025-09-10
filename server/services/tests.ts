import { Hono } from 'hono';
import type { JwtVariables } from 'hono/jwt';
import { HTTPException } from 'hono/http-exception';
import testModel from '../models/test';
import fileModel from '../models/file';

type jwtPayload = {
  userId: string;
  role: 'admin' | 'user';
  exp: number;
};

type Variables = JwtVariables<jwtPayload>;

const tests = new Hono<{ Variables: Variables }>();

tests.get('/', async (c) => {
  const jwtPayload = c.get('jwtPayload');

  if (jwtPayload.role !== 'admin') {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  const tests = await testModel.find().select('-__v');

  return c.json({ ok: true, tests: tests });
});

async function fileUpload(file: File) {
  try {
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file');
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length === 0) {
      throw new Error('Empty file');
    }
    // Extract original file extension
    const originalName = file.name;
    const extension = originalName.includes('.') ? `.${originalName.split('.').pop()}` : '';
    const filename = crypto.randomUUID() + extension;
    const path = `./uploads/${filename}`;
    await Bun.write(path, buffer);

    const fileDoc = await fileModel.create({ path });
    return fileDoc._id;
  } catch (err) {
    console.error(err);
    throw new HTTPException(500, { message: 'File upload failed' });
  }
}

tests.post('/', async (c) => {
  const jwtPayload = c.get('jwtPayload');

  if (jwtPayload.role !== 'admin') {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  const formData = await c.req.formData();
  console.log('Raw form-data:', [...formData.entries()]); // Debug log

  const data: any = {
    title: formData.get('title'),
    reading: { sections: {} },
    listening: {},
    writing: { sections: {} },
  };

  // Helper to process files
  const uploadFiles = async (files: File | File[] | string | string[]) => {
    const fileArray = Array.isArray(files) ? files : [files].filter((f) => f instanceof File);
    if (!fileArray.length) {
      console.warn('No valid files provided');
      return [];
    }
    //@ts-ignore
    return Promise.all(fileArray.map(fileUpload));
  };

  // Process reading sections
  const readingSections = ['one', 'two', 'three', 'four'];
  for (const section of readingSections) {
    data.reading.sections[section] = {
      title: formData.get(`reading.sections.${section}.title`),
      content: formData.get(`reading.sections.${section}.content`),
      //@ts-ignore
      files: await uploadFiles(formData.getAll(`reading.sections.${section}.files[]`)),
    };
  }

  // Process listening
  data.listening = {
    content: formData.get('listening.content'),
    //@ts-ignore
    files: await uploadFiles(formData.getAll('listening.files[]')),
  };

  // Process writing sections
  const writingSections = ['one', 'two'];
  for (const section of writingSections) {
    data.writing.sections[section] = {
      title: formData.get(`writing.sections.${section}.title`),
      content: formData.get(`writing.sections.${section}.content`),
      //@ts-ignore
      files: await uploadFiles(formData.getAll(`writing.sections.${section}.files[]`)),
    };
  }

  console.log('Processed data:', JSON.stringify(data, null, 2)); // Debug log
  await testModel.create(data);

  return c.json({ ok: true, message: 'Created' }, 201);
});

export default tests;
