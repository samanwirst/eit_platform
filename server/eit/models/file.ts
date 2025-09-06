import mongoose from 'mongoose';

interface File {
  path: string;
}

const fileSchema = new mongoose.Schema<File>({
  path: {
    type: String,
    required: true,
  },
});

const fileModel = mongoose.model<File>('File', fileSchema);

export default fileModel;
