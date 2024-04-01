import exp from "constants";
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    attendance: {
      type: String,
      enum: ['full', 'half', 'quarter', 'none'],
      default: 'none',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
  });

attendanceSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
      delete ret._id;
      delete ret.__v;
      delete ret.date;
      delete ret.user;
    }
  });

export const AttendanceModel = mongoose.model('Attendance', attendanceSchema);