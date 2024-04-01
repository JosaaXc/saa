
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({

    name: {
    type: String,
    required: [true, "Name is required"],
    },

    enrollment: { // matricula
    type: String,
    required: [true, "Enrollment is required"],
    },



    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
    }, 

});

studentSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret, options ) { 
        delete ret._id 
    }

})

export const StudentModel = mongoose.model("Student", studentSchema);