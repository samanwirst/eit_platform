import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import testModel from '../models/test';
import fileModel from '../models/file';

const test = new Hono();

test.delete('/:id', async (c) => {
  const jwtPayload = c.get('jwtPayload');

  if (jwtPayload.role !== 'admin') {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  const testId = c.req.param('id');
  const test = await testModel.findById(testId);

  if (!test) {
    throw new HTTPException(404, { message: 'Test not found' });
  }

  // Collect all file IDs from reading, listening, and writing sections
  const fileIds: string[] = [];

  // Reading sections
  const readingSections = ['one', 'two', 'three', 'four'];
  for (const section of readingSections) {
    //@ts-ignore
    if (test.reading.sections[section]?.files) {
      //@ts-ignore
      fileIds.push(...test.reading.sections[section].files);
    }
  }

  // Listening section
  if (test.listening?.files) {
    //@ts-ignore
    fileIds.push(...test.listening.files);
  }

  // Writing sections
  const writingSections = ['one', 'two'];
  for (const section of writingSections) {
    //@ts-ignore
    if (test.writing.sections[section]?.files) {
      //@ts-ignore
      fileIds.push(...test.writing.sections[section].files);
    }
  }

  // Delete associated files
  if (fileIds.length > 0) {
    await fileModel.deleteMany({ _id: { $in: fileIds } });
  }

  // Delete the test
  await testModel.deleteOne({ _id: testId });

  return c.body(null, 204);
});

export default test;
