const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // fixed typo: "require" -> "required"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // fixed typo
    },
    status: {
      type: String,
      required: true, // fixed typo
      enum: {
        values: ['pending', 'accepted', 'rejected', 'ignored', 'interested'],
        message: '{VALUE} is not a valid status type',
      },
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.pre('save', function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    return next(new Error('Cannot send connection request to yourself'))
  }
  next()
})

// 3. Export the model
const ConnectionRequestModel = mongoose.model(
  'ConnectionRequest',
  connectionRequestSchema,
)

module.exports = {
  ConnectionRequestModel,
}
