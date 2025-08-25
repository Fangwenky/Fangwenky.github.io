const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// 加载环境变量
dotenv.config();

// 导入模型
const Province = require('./models/Province');
const Classmate = require('./models/Classmate');
const Message = require('./models/Message');
const Comment = require('./models/Comment');
const Admin = require('./models/Admin');

// 连接数据库
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB 连接成功');
  seedData();
}).catch(err => {
  console.error('MongoDB 连接失败:', err);
});

// 示例数据
async function seedData() {
  try {
    // 清空现有数据
    await Province.deleteMany({});
    await Classmate.deleteMany({});
    await Message.deleteMany({});
    await Comment.deleteMany({});
    
    // 创建省份数据
    const provinces = await Province.insertMany([
      {
        name: '北京',
        englishName: 'Beijing',
        description: '中国的首都，政治、文化、国际交往中心',
        mapCoordinates: { x: 116.4, y: 39.9 }
      },
      {
        name: '上海',
        englishName: 'Shanghai',
        description: '中国最大的经济中心城市，国际金融中心',
        mapCoordinates: { x: 121.5, y: 31.2 }
      },
      {
        name: '广东',
        englishName: 'Guangdong',
        description: '中国南方经济发达省份，改革开放前沿',
        mapCoordinates: { x: 113.3, y: 23.1 }
      }
    ]);
    
    console.log('省份数据创建成功');
    
    // 创建同学数据
    const classmates = await Classmate.insertMany([
      {
        name: '张三',
        province: provinces[0]._id,
        school: '北京大学',
        major: '计算机科学',
        imagePath: '/uploads/student1.jpg'
      },
      {
        name: '李四',
        province: provinces[1]._id,
        school: '复旦大学',
        major: '金融学',
        imagePath: '/uploads/student2.jpg'
      },
      {
        name: '王五',
        province: provinces[2]._id,
        school: '中山大学',
        major: '医学',
        imagePath: '/uploads/student3.jpg'
      }
    ]);
    
    console.log('同学数据创建成功');
    
    // 创建留言数据
    const messages = await Message.insertMany([
      {
        author: '张三',
        content: '<p>大家好！我现在在北京大学学习计算机科学，希望以后能成为一名优秀的软件工程师。</p>',
        status: 'visible',
        likes: 5,
        isPinned: true
      },
      {
        author: '李四',
        content: '<p>我在上海复旦大学学习金融，这里的金融环境非常好，学到了很多实用知识。</p>',
        status: 'visible',
        likes: 3,
        isPinned: false
      },
      {
        author: '王五',
        content: '<p>广东的天气真的很热，但是这里的美食太棒了！我在中山大学学医，压力很大但是很充实。</p>',
        status: 'visible',
        likes: 4,
        isPinned: false
      }
    ]);
    
    console.log('留言数据创建成功');
    
    // 创建评论数据
    await Comment.insertMany([
      {
        messageId: messages[0]._id,
        author: '李四',
        content: '加油，计算机行业前景很好！',
        status: 'visible',
        likes: 2
      },
      {
        messageId: messages[0]._id,
        author: '王五',
        content: '北大的计算机专业很厉害，羡慕你！',
        status: 'visible',
        likes: 1
      },
      {
        messageId: messages[1]._id,
        author: '张三',
        content: '上海的金融业确实发达，你选对了地方！',
        status: 'visible',
        likes: 2
      }
    ]);
    
    console.log('评论数据创建成功');
    
    // 检查是否已有管理员账户
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      // 创建默认管理员账户
      await Admin.create({
        username: 'admin',
        password: 'admin123'
      });
      console.log('默认管理员账户创建成功');
    }
    
    console.log('数据初始化完成');
    process.exit(0);
  } catch (error) {
    console.error('数据初始化失败:', error);
    process.exit(1);
  }
}