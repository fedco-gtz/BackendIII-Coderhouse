import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://gutierrezfedericog:ZGu2Q70OsMrmWJL9@cluster0.yex3ufx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Base de datos conectada correctamente');
  } catch (error) {
    console.error('Error al conectar base de datos', error);
    process.exit(1);
  }
};

export default connectDB;