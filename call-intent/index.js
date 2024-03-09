const PubSub = require("pubsub-js");
const { INTENT_STORE } = require("../constants");
const { getDatabase } = require("../db");
const { end } = require("../globalUtils");
let intents;

/**
 * 获取与给定名称或ID匹配的上下文中的意图对象。
 * @param {string} nameOrID - 要匹配的名称或ID。
 * @param {Record<string, object>} context - 上下文对象。
 * @returns {object|undefined} 匹配的意图对象，如果没有找到匹配项，则返回undefined。
 */
const getMatchingIntentFromContext = (nameOrID = "", context) => {
  return Object.values(context).find((intent) => {
    return intent.name === nameOrID || intent.id === nameOrID;
  });
};

/**
 * 向回调函数发送字符串错误或上下文中的匹配节点。
 * @param {string} nameOrId - 要查找的名称或ID。
 * @param {object} context - 上下文对象。
 * @param {function} callback - 回调函数。
 */
const getNode = (nameOrId, context, callback) => {
  const node = getMatchingIntentFromContext(nameOrId, context);
  if (!nameOrId) {
    callback("payload没有提供nodeName属性");
  } else if (!node) {
    callback(`没有找到与名称或ID "${nameOrId}" 匹配的意图`);
  } else {
    callback(null, node);
  }
};

module.exports = function (RED) {
  // 定义CallIntentHandlerNode函数，用于创建节点
function CallIntentHandlerNode(config) {
    // 创建节点
    RED.nodes.createNode(this, config);
    const node = this;

    // 监听输入事件
    this.on("input", function (msg, send, done = () => {}) {
      // 获取全局上下文
      const globalContext = node.context().global;
      // 获取上下文
      const context = globalContext.get(INTENT_STORE) || {};
      // 获取配置的节点ID
      const { registeredNodeId = "" } = config;

      // 设置发送函数
      send =
        send ||
        function () {
          node.send.apply(node, arguments);
        };

      // 判断msg.payload是否为数组
      if (Array.isArray(msg.payload)) {
        // 遍历数组
        msg.payload.forEach((payload) => {
          // 获取节点名称
          const { nodeName } = payload;

          // 获取节点
          getNode(nodeName, context, (err, registeredNode) => {
            // 错误处理
            if (err) {
              node.warn(err);
            } else {
              // 发布消息
              PubSub.publishSync(registeredNode.id, msg);
              send(msg);
            }
          });
        });
      } else {
        // 获取节点名称或ID
        const nameOrId = msg.payload?.nodeName || registeredNodeId;

        // 获取节点
        getNode(nameOrId, context, (err, registeredNode) => {
          // 错误处理
          if (err) {
            node.warn(err);
          } else {
            // 发布消息
            PubSub.publishSync(registeredNode.id, msg);
            send(msg);
          }
        });
      }
      // 结束
      end(done);
    });
  }

  getDatabase(async (storage) => {
    intents = await storage.values();

    RED.nodes.registerType("Call Intent", CallIntentHandlerNode, {
      settings: {
        callIntentRegistry: {
          value: intents,
          exportable: true,
        },
      },
    });
  });

  RED.httpAdmin.get("/registered-intents", function (req, res) {
    getDatabase(async (storage) => {
      intents = await storage.values();
      res.json(intents);
    });
  });
};