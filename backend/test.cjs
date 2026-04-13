const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://user_123:kozRqcrBCFOD9YDn@cluster0.uapspmo.mongodb.net/project-6?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    const schema = new mongoose.Schema({ fileCV: String, jobId: String, fullName: String, status: String }, { strict: false });
    const CV = mongoose.model('CV', schema, 'cvs');
    return CV.findOne().sort({ createdAt: -1 });
  })
  .then(cv => {
    console.log(cv);
    mongoose.disconnect();
  });
