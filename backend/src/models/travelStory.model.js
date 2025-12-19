import mongoose from "mongoose";

const travelStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    story: {
      type: String,
      required: [true, "Story content is required"],
      minlength: 10,
    },
    location: {
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      place: {
        type: String,
      },
    },
    travelDate: {
      type: Date,
      required: true,
    },
    imageUrl: {
      type: String,
      required:true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// pre arka planda create methodu save ve validate için otomatik çalışır
// 🔥 CREATE öncesi otomatik PUBLISHED

travelStorySchema.pre("save", function () {
  if (this.isNew) { // sadece create yapıldığıdna çalışır update veya patch zamanı çalışmaz.
    this.status = "PUBLISHED";
  }
});

const TravelStory = mongoose.model("TravelStory", travelStorySchema);

export default TravelStory;
