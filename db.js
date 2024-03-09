// 导入node-persist库，用于持久化存储数据
const storage = require("node-persist");

// 定义一个异步函数，用于获取数据库实例
async function getDatabase(cb) {
  // 如果该函数还未被执行过，则执行初始化操作
  if (!getDatabase.didRun) {
    getDatabase.didRun = true;
    // 初始化node-persist
    await storage.init();
    // 清除数据库中的所有数据
    await storage.clear();
  }
  // 调用回调函数，将数据库实例传递给调用者
  cb(storage);
}

// 将获取数据库的函数导出，以便在其他文件中使用
module.exports = { getDatabase };
