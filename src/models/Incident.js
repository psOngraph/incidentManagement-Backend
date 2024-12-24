const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: true,
    },
    category: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Category",
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    incidentNumber: {
      type: Number,
      unique: true,
    },
    severity: {
      type: String,
      // enum: ["high", "medium", "low"],
      // default: "low",
      // required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
      required: true,
    },
    images: {
      type: [String], // Array of image links
      default: [],
    },
    comment: {
      type: String,
      trim: true,
    },
    voiceNote: {
      type: String, // Link to the voice note
    },
    location: {
      latitude: {
        type: String,
        required: true,
      },
      longitude: {
        type: String,
        required: true,
      },
    },
    address: {
      type: String,
    },
    folderPath: {
      type: String,
    },
    // deviceId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Device",
    // },
    vehicleNumber: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// Pre-save hook to auto-increment incidentNumber
incidentSchema.pre("save", async function (next) {
  if (!this.incidentNumber) {
    const lastIncident = await mongoose
      .model("Incident")
      .findOne({}, { incidentNumber: 1 })
      .sort({ incidentNumber: -1 });
    this.incidentNumber = lastIncident ? lastIncident.incidentNumber + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Incident", incidentSchema);
