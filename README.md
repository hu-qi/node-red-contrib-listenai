## Intents A.I For ListenAI

> Forked from the [@infozap/node-red-contrib-ai-gpt-intent](https://www.npmjs.com/package/@infozap/node-red-contrib-ai-gpt-intent?activeTab=code).

这是一组节点，旨在帮助改进现有的自动化流程，使其能够被聊天机器人使用，并利用诸如GPT之类的大型语言模型（LLM）的优势。此集合中包含4个节点：

### Register Intent（注册意图）

此节点创建一个可由**Call Intent**节点激活的订阅。至少，此节点可以用作在不同流程中链接自动化的方式，非常类似于原生的`Link In`/`Link Out`节点，但没有使用位置的限制。此外，这些节点会自动添加到**OpenAI Chat**节点的有效负载中，作为OpenAI可以调用的函数。如果这对您的结果产生负面影响，您可以使用`excludeFromOpenAI`复选框将它们从有效负载中排除。

> 您不需要注册同名的意图节点。这会导致不期望的结果。

### Call Intent（调用意图）

激活关联的**Register Intent**节点。当此节点直接附加在**OpenAI Response**节点之后时，它可以动态激活已注册的意图。要查看此操作，请检查示例文件夹并查找`openai-call-registered-intent-example.json`。

### OpenAI Chat（OpenAI聊天）

通过使用来自**OpenAI User**、**OpenAI System**和**OpenAI Tools**的信息构建有效负载来调用OpenAI。
上述三个节点必须在流程中首先使用，因为它们提供**OpenAI Chat**所需的信息。

### OpenAI User（OpenAI用户）

提供带有role = user的消息，以便在OpenAI的聊天完成有效负载中使用。此节点还能够使用字符串替换，并可以用msg对象的数据替换字符串有效负载中的标记化内容。任何位于单个大括号`{}`之间的文本都将被视为msg对象中的键。

### OpenAI System（OpenAI系统）

提供带有role = system的消息，以便在OpenAI的聊天完成有效负载中使用。此节点还能够使用字符串替换，并可以用msg对象的数据替换字符串有效负载中的标记化内容。任何位于单个大括号`{}`之间的文本都将被视为msg对象中的键。

### OpenAI Tool（OpenAI工具）

提供Open AI可用来处理独家请求的函数。这些节点可以与其他**AI Tool**节点链接，系统会自动将后续函数附加到同一有效负载上。

### OpenAI Response（OpenAI响应）

处理OpenAI的响应。这提供了一致且易于阅读的输出，但也会将OpenAI的原始输出传递到一个名为`originalResponse`的单独属性中。

### 如何使用

> 注意：您需要有一个有效的OpenAI令牌才能使此功能起作用。访问[OpenAI](https://platform.openai.com/)。

获得有效令牌后，有两种安装方法。

#### 配置节点

#### Settings.js文件

或者，您可以将令牌添加到settings.js文件中。该文件可以在`.node-red/settings.js`路径（或某些等效路径）中找到。根据多位用户的报告，位置似乎因安装方式而异。如果遇到问题，您可能需要进行全局搜索。找到文件后，搜索`functionGlobalContext`属性并添加以下内容：

```
  functionGlobalContext: {
    openaiAPIKey: "您的API令牌放在这里",
  },
```

请确保在保存此文件后重新启动node-red。这种方法比配置节点更复杂，但您可以自由共享和导出流程和自动化，因为令牌将在流程中隐藏。