import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: { 
    type: Date, 
    default: Date.now 
  }
});

// Método para obtener el siguiente ID
userSchema.statics.getNextId = async function() {
  const lastUser = await this.findOne().sort({ id: -1 });
  return lastUser ? lastUser.id + 1 : 1;
};

const User = mongoose.model('User', userSchema);

export default User;