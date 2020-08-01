const mongoose = require('mongoose');

const conn = mongoose.createConnection('mongodb://localhost:27017/db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let UserSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String
  },
  password: String,
  age: Number
}, {
  collection: 'user'
});
let User = conn.model('User', UserSchema);
let ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  createAt: {
    type: Date,
    default: Date.now
  },
  // 关联表，将文章和用户关联到一起
  user: {
    ref: 'User',
    type: mongoose.SchemaTypes.ObjectId // 通过_id 创建一个关联
  }
}, { collection: 'article' });
let Article = conn.model('Article', ArticleSchema);
// 每个用户可以发表文章

(async () => {

  // 创建一个用户和一篇文章
  // 使用user id 将 文章和用户关联起来
  let user = await User.create({ username: 'supengyu', password: 'supengyu' });
  let article = await new Article({ title: 'mongodb使用', content: '如何使用', user: user._id }).save();

  // 我知道文章的id号 我希望查询到这个文章是谁写的
  // 1 代表需要这个数据，0代表不需要   
  let article = await Article.findById('5e99a615e8d10a2fa84ba09e').populate("user", { username: 1, _id: 0 });
  console.log(article);

})();
