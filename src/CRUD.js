const mongoose = require('mongoose');

/**
 * db 是一个链接对象，可以通过他操作我们的数据库
 */
const db = mongoose.createConnection('mongodb://localhost:27017/test', {
  // 新版本增加的字段
  useNewUrlParser: true,
  useUnifiedTopology: true
})

/**
 * 尽可能的让数据结构化存储，保证每一行数据都是遵循一定结构 -> schema
 * 
 * 表(SQL) === 集合(MongoDB)
 * 
 * 行(SQL) -> 文档(MongoDB)
 */
let UserSchema = new mongoose.Schema({
  username: {
    required: true,
    unique: true,
    trim: true,
    type: String,
  },
  password: {
    required: true,
    trim: true,
    type: String,
  }
}, { collation: "user" })


/**
 * 可以在Schema构造函数上 上扩展通用性方法，可以在集合上直接调用
 * 
 * eg: User.findByName
 * 
 * this 指向：调用该方法的集合
 * 
 * @param {*} username 
 */
UserSchema.statics.findByName = function (username) {
  return this.findOne({
    username
  });
}
/**
 * 通过他自己(文档)找到所在的集合，然后再通过集合找到...这个实例的username
 * 
 * eg: new User().savePassword
 * 
 * this 指向:文档自己
 */
UserSchema.methods.savePassword = function () {
  this.password = require('crypto').createHash('md5').update(this.password).digest('base64');
  return this.save();
}

/**
 * mongo 操作数据常用两种方式：
 * 
 * 集合来操作 
 * 
 * 文档来操作
 * 
 * 通过Schema创建模型:用来操作数据库 === 集合
 */
let User = db.model('user', UserSchema);

(async () => {
  // (0) 删除数据

  // (1) 增加数据：create 
  //  应用场景：用户注册
  let user = await User.create({
    username: "supengyu",
    password: "test"
  })
  // 创建一个文档，并手动存入到User集合中
  let document = await new User({ username: 'lichunyue', password: 'lichunyue', }).save();
  // 此时返回的user就是一个JOSN
  console.log(user);

  // (2) 查询数据
  let result = await User.find('supengyu');
  console.log(result)
  db.close();

  // --- 分页功能 ---

  // 其他查询 分页 limit skip sort 
  let arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push({ username: '张三' + i, password: 'zs' + i, age: i + 1 })
  }
  let r = await User.create(arr);
  // 每页5条， 第2页

  // 函数执行顺序优先级： find => sort => skip => limit  
  // exec  就是开始执行，或者使用 await

  // let result = await User.find({}).limit(5).skip(5).sort({age:-1});
  // console.log(result)
})()