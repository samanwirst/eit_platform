import mongoose from 'mongoose';
import userModel from './models/user';

async function main() {
  try {
    await mongoose.connect(Bun.env.MONGO_URI);

    await userModel.create({
      firstName: 'Sardor',
      lastName: 'Absamatov',
      phoneNumber: '998990366996',
      password: await Bun.password.hash('kbsZg3kuc$8yCAy!'),
      role: 'admin',
    });

    console.log('Created!');
  } catch (err) {
    console.error(err);
  }
}

main();
