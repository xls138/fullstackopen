const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)

  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    unique: true, // 确保名字是唯一的
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        // 正则表达式用于匹配有效的电话号码
        return /^(?:\d{8,}|(?:\d{2,3}-\d+))$/.test(v);
      },
      message: (props) => `${props.value} 不是一个有效的电话号码！`,
    },
  },
});


personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
