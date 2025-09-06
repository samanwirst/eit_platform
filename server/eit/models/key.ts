import mongoose from 'mongoose';

interface AccessKey {
  key: string;
  user: mongoose.Types.ObjectId;
  test: mongoose.Types.ObjectId;
}

const keySchema = new mongoose.Schema<AccessKey>({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
});

const keyModel = mongoose.model('Key', keySchema);

export default keyModel;
