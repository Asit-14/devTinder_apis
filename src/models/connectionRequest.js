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
        values: ['ignore', 'interested', 'accepted', 'rejected'], 
        message: '{VALUE} is not a valid status type',
      },
    },
  },
  {
    timestamps: true,
  },
)

const ConnectionRequestModel = mongoose.model(
  'ConnectionRequest',
  connectionRequestSchema,
)

module.exports = {
  ConnectionRequestModel,
}
