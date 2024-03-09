// 获取全局上下文
const { INTENT_STORE } = require("./constants");
const { getDatabase } = require("./db");

// 定义结束函数
function end(done, error) {
  if (done) {
    done(error);
  }
}

// 定义上下文数据库类
class ContextDatabase {
  constructor(globalContext, config) {
    // 获取全局上下文
    this.globalContext = globalContext;
    // 获取注册意图存储
    this.nodeStore = this.globalContext.get(INTENT_STORE) || {};
    // 获取配置
    this.config = config;
    // 创建一个新的注册意图项
    this.nodeStore[this.config.id] = config;
  }

  // 初始化数据库
  initialize() {
    const id = this.config.id;
    // 触发数据库保存
    getDatabase(async (storage) => {
      // 获取指定节点ID的注册意图数据
      const savedTool = await storage.get(id);

      // 如果数据不存在或与当前节点ID匹配，则更新数据
      if (!savedTool || savedTool.id === id) {
        await storage.setItem(id, this.nodeStore[id]);
      }
    });

    // 存储用于存储所有注册意图节点的数据
    // 这允许我们在调用呼叫意图节点时查找此信息
    this.globalContext.set(INTENT_STORE, this.nodeStore);
  }

  // 删除节点
  deleteNode(cb = () => {}) {
    getDatabase(async (storage) => {
      console.log("删除节点: ", this.config.name);
      const nodeId = this.config.id;
      const nodeStore = this.globalContext.get(INTENT_STORE) || {};
      delete nodeStore[nodeId];
      this.globalContext.set(INTENT_STORE, nodeStore);

      // 从存储中删除节点
      await storage.removeItem(nodeId);
      cb();
    });
  }

  // 获取存储中的所有节点
  getNodesFromStore() {
    return new Promise((resolve) => {
      getDatabase((storage) => {
        resolve(storage.values());
      });
    });
  }
}

// 导出模块
module.exports = { end, ContextDatabase };
