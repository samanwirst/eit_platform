import mongoose from 'mongoose';

interface Test {
  title: string;
  reading: {
    sections: {
      one: {
        title: string;
        content: string;
        files: mongoose.Types.ObjectId[];
      };
      two: {
        title: string;
        content: string;
        files: mongoose.Types.ObjectId[];
      };
      three: {
        title: string;
        content: string;
        files: mongoose.Types.ObjectId[];
      };
      four: {
        title: string;
        content: string;
        files: mongoose.Types.ObjectId[];
      };
    };
  };
  listening: {
    content: string;
    files: mongoose.Types.ObjectId[];
  };
  writing: {
    sections: {
      one: {
        title: string;
        content: string;
        files: mongoose.Types.ObjectId[];
      };
      two: {
        title: string;
        content: string;
        files: mongoose.Types.ObjectId[];
      };
    };
  };
}

const testSchema = new mongoose.Schema<Test>({
  title: {
    type: String,
  },
  reading: {
    sections: {
      one: {
        title: {
          type: String,
        },
        content: {
          type: String,
        },
        files: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File',
          },
        ],
      },
      two: {
        title: {
          type: String,
        },
        content: {
          type: String,
        },
        files: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File',
          },
        ],
      },
      three: {
        title: {
          type: String,
        },
        content: {
          type: String,
        },
        files: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File',
          },
        ],
      },
      four: {
        title: {
          type: String,
        },
        content: {
          type: String,
        },
        files: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File',
          },
        ],
      },
    },
  },
  listening: {
    content: {
      type: String,
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
  },
  writing: {
    sections: {
      one: {
        title: {
          type: String,
        },
        content: {
          type: String,
        },
        files: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File',
          },
        ],
      },
      two: {
        title: {
          type: String,
        },
        content: {
          type: String,
        },
        files: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File',
          },
        ],
      },
    },
  },
});

const testModel = mongoose.model<Test>('Test', testSchema);

export default testModel;
