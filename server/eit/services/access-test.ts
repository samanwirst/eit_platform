import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import keyModel from '../models/key';
import testModel from '../models/test';

const accessTest = new Hono();

function transformTest(test: any) {
  const clone = JSON.parse(JSON.stringify(test));
  const readingSecs = ['one', 'two', 'three', 'four'];
  readingSecs.forEach((sec) => {
    clone.reading.sections[sec].files = clone.reading.sections[sec].files.map(
      (f: any) => `/uploads/${f.path.split('/').pop()}`
    );
  });
  clone.listening.files = clone.listening.files.map(
    (f: any) => `/uploads/${f.path.split('/').pop()}`
  );
  const writingSecs = ['one', 'two'];
  writingSecs.forEach((sec) => {
    clone.writing.sections[sec].files = clone.writing.sections[sec].files.map(
      (f: any) => `/uploads/${f.path.split('/').pop()}`
    );
  });
  return clone;
}

accessTest.get('/:key', async (c) => {
  const key = c.req.param('key');
  const access = await keyModel.findOne({ key });
  if (!access) {
    throw new HTTPException(404, { message: 'Invalid key' });
  }
  let populatedTest = await testModel
    .findById(access.test)
    .populate('reading.sections.one.files')
    .populate('reading.sections.two.files')
    .populate('reading.sections.three.files')
    .populate('reading.sections.four.files')
    .populate('listening.files')
    .populate('writing.sections.one.files')
    .populate('writing.sections.two.files');
  if (!populatedTest) {
    throw new HTTPException(404, { message: 'Test not found' });
  }
  await keyModel.deleteOne({ key });
  const transformed = transformTest(populatedTest);
  return c.json({ ok: true, test: transformed });
});

export default accessTest;
