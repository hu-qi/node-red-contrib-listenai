## Intents A.I - OPENAI

> Forked from the [@infozap/node-red-contrib-ai-gpt-intent](https://www.npmjs.com/package/@infozap/node-red-contrib-ai-gpt-intent?activeTab=code).

Esta é uma coleção de nós para ajudar a aprimorar as automações existentes a serem utilizadas por chatbots e aproveitar as vantagens de LLMs como GPT. Existem 4 nós nesta coleção:

### Register Intent

Este nó cria uma assinatura que pode ser ativada pelo nó **Call Intent**. No mínimo, este nó pode ser usado como uma forma de vincular automações em diferentes fluxos, muito semelhantes aos nós nativos `Link In`/`Link Out`, mas não tem restrições de onde pode ser usado. Além disso, esses nós são adicionados automaticamente à carga útil do nó **OpenAI Chat** como funções que o OpenAI pode chamar. Se isso afetar negativamente seus resultados, você pode excluí-los da carga usando a caixa de seleção `excludeFromOpenAI`.

> Você não pode precisar registrar nós de intenção com o mesmo nome. Isso levará a resultados indesejados

### Call Intent

Aciona o nó **Register Intent** associado. Quando esse nó é anexado diretamente após o nó **OpenAI Response**, ele pode acionar dinamicamente intenções registradas. Para ver isso em ação, verifique a pasta de exemplos e procure por `openai-call-registered-intent-example.json`.

### OpenAI Chat

Chama OpenAI construindo uma carga útil usando as informações de **OpenAI User**, **OpenAI System** e **OpenAI Tools**.
Os três nós mencionados acima devem ser usados primeiro durante o fluxo, pois fornecem as informações necessárias para o **OpenAI Chat**
usar.

### OpenAI User

Fornece a mensagem com role = user para usar no Payload de conclusão de chat do OpenAI. Este nó também é capaz de utilizar substituição de string e pode substituir o conteúdo tokenizado na carga útil da string por dados do objeto msg. Qualquer texto entre chaves simples `{}` será tratado como uma chave no objeto msg.

### OpenAI System

Fornece a mensagem com role = system para usar no Payload de conclusão de chat do OpenAI. Este nó também é capaz de utilizar substituição de string e pode substituir o conteúdo tokenizado na carga útil da string por dados do objeto msg. Qualquer texto entre chaves simples `{}` será tratado como uma chave no objeto msg.

### OpenAI Tool

Fornece funções que o Open AI pode usar para lidar com solicitações exclusivas. Esses nós podem ser encadeados com outros nós da **AI Tool** e o sistema anexará automaticamente funções subsequentes à mesma carga útil.

### OpenAI Response

Sanitiza a resposta do OpenAI. Isso fornece uma saída consistente e fácil de ler, mas também passará a saída original do OpenAI em uma propriedade separada chamada `originalResponse`.

### Como usar

> NOTA: Você precisa ter um token válido da OpenAI para que isso funcione. Visite [OpenAI](https://platform.openai.com/).

Depois de ter um token válido, há duas maneiras de instalá-lo.

#### Configuration Node

#### Settings.js File

Alternativamente, você pode adicionar seu token ao arquivo settings.js. O arquivo pode ser encontrado no caminho `.node-red/settings.js` (ou algum equivalente). Com base em relatórios de vários usuários, o local parece ser um pouco diferente dependendo de como você o instalou. Você pode querer fazer uma pesquisa global se estiver tendo problemas. Depois de encontrar o arquivo, procure a propriedade `functionGlobalContext` e adicione o seguinte:

```
  functionGlobalContext: {
    openaiAPIKey: "YOUR-TOKEN-API-GOES-HERE",
  },,

```

Certifique-se de reiniciar o node-red depois de salvar este arquivo. Este método é mais complicado do que o nó Configuração, mas você pode compartilhar e exportar livremente seus fluxos e automações, pois o token ficará oculto no fluxo.
