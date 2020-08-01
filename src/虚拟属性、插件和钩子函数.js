// mongo 还有一些其他用法  虚拟属性  钩子  插件的用法
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

/**
 * 
 * @param {*} schema 谁调用这个plugin schema就指向谁
 * @param {*} options 
 */
function plugin(schema, options) {
  // 类似vue中的计算属性（虚拟属性）  (并不会存储到数据库中)
  schema.virtual('usernameAndPassword').get(function () {
    return this.username + ':' + this.password
  });
  // 场景：用户注册前 需要查询用户是否存在   pre钩子 post钩子
  schema.pre(/^find/, function (next) {
    console.log('开始查询');
    setTimeout(() => {
      next();
    }, 1000);
    console.log('结束查询')
  });
}
// 谁调用这个插件 默认第一个参数就是当前的骨架
UserSchema.plugin(plugin, { c: 1 });
let User = conn.model('User', UserSchema);
(async () => {
  let r = await User.findOne({
    username: 'zf'
  });
  console.log(r.usernameAndPassword);
  conn.close()
})()