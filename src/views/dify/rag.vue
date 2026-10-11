<template>
       <div style="line-height: 5vh;padding:2vh 5vw;">
        <h2>RAG</h2>
        <div>RAG是一种结合知识检索和语言生成的人工智能技术，主要用于解决大型语言模型幻觉问题</div>
        <img src="../../assets/dify/rag.png" alt="">
        <div>基本原理：在生成回答时，先从知识库中检索相关文档。将检索到的文档与原始问题一起输入LLM，LLM基于检索内容生成最终答案</div>
        <h2>知识库构建</h2>
        <h3>1.文档准备</h3>
        <div style="display: flex;justify-content: space-around;">
                   <img src="../../assets/dify/zsk.png" alt="">
                   <img src="../../assets/dify/zsk1.png" alt="">
                   <img src="../../assets/dify/zsk2.png" alt="">


        </div>
        <h3>2.文档切片</h3>
        <div>文档切片：为了适应大语言模型的上下文长度限制，并提升检索的精确度和效率</div>
                   <img src="../../assets/dify/qp.png" alt="">
<h3>3.文档向量化</h3>
<div>文档向量化：将切分后的文本进行向量数字化，便于计算问题和文档的相似性</div>
<div>向量化作用：语义理解，相似度计算，快速检索</div>
                   <img src="../../assets/dify/ragzj.png" alt="">
<h3>基本操作步骤</h3>
                   <img src="../../assets/dify/zskcz.png" alt="">

<div>1.创建知识库</div>
                   <img src="../../assets/dify/difyzsk.png" alt="" style="zoom: 80%;">
                   <div>2.导入准备好的文件</div>
                   <img src="../../assets/dify/difyzsk1.png" alt="">
                   <div>3.设置分段标识符，分段最大长度，分段重叠度，点击预览块可预览</div>
                   <div>分段标识符是告诉系统以什么“标志”作为切分文本的边界</div>
                   <div>分段最大长度是指定每个分段内文本字符数（或 Tokens 数）的上限，当文本内容超过这个设定的长度限制时，无论是否遇到分段标识符，系统都会强制进行分段</div>
                   <div>分段重叠度是指在切分数据时，相邻两个分段之间共享的字符数或 Tokens 数。例如，如果分段最大长度为 500，重叠度设为 50，那么第一段的最后 50 个字符也会作为第二段的前 50 个字符出现。设置重叠度的主要作用是保留分段之间的语义连接，防止关键信息（如段尾的结论和段首的引言）正好被切在边界处而丢失上下文，从而有效提升检索的召回效果</div>
                   <img src="../../assets/dify/difyzsk2.png" alt="">
                   <div>3.自定义设置</div>
                   <img src="../../assets/dify/difyzsk3.png" alt="">
                   <div>4.成功显示</div>
                   <img src="../../assets/dify/difyzsk4.png" alt="">


</div>
</template>
<script setup lang="ts">
</script>