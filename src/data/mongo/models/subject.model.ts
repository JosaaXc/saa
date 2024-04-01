
import mongoose from 'mongoose';


const subjectSchema = new mongoose.Schema( {

  name: {
    type: String,
    required: [ true, 'Name is required' ],
    unique: true
  },
  period: {
    type: Number,
    required: [ true, 'Period is required' ]
  },
  endTime: {
    type: String,
    required: [ true, 'Endtime is required' ]
  },
  daysGiven: { 
    type: [String],
    required: [ true, 'DaysGiven is required' ],
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  
  }
} );

subjectSchema.set( 'toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function ( doc, ret, options ) {
    delete ret._id;
  }
} );


export const SubjectModel = mongoose.model('Subject', subjectSchema);

