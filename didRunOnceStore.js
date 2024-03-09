const KEY = "didRunOnce";

// 定义一个类，用于处理特定的键值对
class DidRunOnce {
  constructor(globalContext) {
    // 将全局上下文传递给类
    this.context = globalContext;
  }

  // 设置键值对
  setForKey(key, value) {
    // 从全局上下文中获取存储对象
    const STORE = this.context.get(KEY) || {};

    // 设置键值对
    STORE[key] = value;

    // 遍历存储对象的所有键，将除当前键以外的键值设置为false
    Object.keys(STORE).forEach((_key) => {
      if (_key !== key) {
        STORE[_key] = false;
      }
    });

    // 将存储对象设置回全局上下文
    this.context.set(KEY, STORE);
  }

  // 获取键值对
  getForKey(key) {
    // 从全局上下文中获取存储对象
    const STORE = this.context.get(KEY) || {};

    // 返回键值对
    return STORE[key];
  }

  // 重置存储对象
  reset() {
    // 将存储对象设置为空对象
    this.context.set(KEY, {});
  }
}

// 导出类
module.exports = { DidRunOnce };
