<template>
    <!-- 页面根容器，承载提示与 3D 小船画布 -->
    <div ref="containerRef" class="sea-scene">
        <!-- 3D 小船画布容器，不新建海浪，只渲染小船和阴影 -->
        <div ref="canvasBoxRef" class="sea-overlay-box" />
        <!-- 鼠标悬浮提示层 -->
        <div v-if="tooltip.visible" class="sea-tooltip" :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
            <!-- 船名 -->
            <div class="sea-tooltip__name">{{ tooltip.name }}</div>
            <!-- 操作提示 -->
            <div class="sea-tooltip__tip">点击查看详情</div>
        </div>

        <!-- 点击小船弹窗 -->
        <el-dialog v-model="dialogVisible" :title="activeBoat?.name || '小船信息'" top="5vh" style="  width: 70vw; height: 85vh;overflow-y: auto;line-height: 4vh;" destroy-on-close>
            <!-- 弹窗内容 -->
            <div v-if="activeBoat?.id == 1">
                <ul>
                    <li>Vue2的api 设计是Option（配置）风格</li>
                    <li>Vue3的api设计是composition（组合）风格</li>

                </ul>
                <div class="size_big">OptionApi弊端</div>
                <div>
                    Option类型的api，数据，方法，计算属性，是分布在data,methods,computed中的，如果想新增或者修改一个需求，就需分别修改data,methods,computed，不便于维护复用。
                </div>
                <img class="img_pic" src="../../assets/images/option.gif">
                <img class="img_pic" src="../../assets/images/optionApi.gif">
                <div class="size_big">compositionApi优势</div>
                <div>可以用函数的方式，更好的组织代码，让相关功能代码更有序组织在一起。</div>
                <img class="img_pic" src="../../assets/images/composition.gif">
                <img class="img_pic" src="../../assets/images/compositionApi.gif">
            </div>
            <div v-if="activeBoat?.id == 2">
                <span>Setup是v3中的一个新的配置项，值是一个函数，v2用的都配置在这里面</span>
                <ul>
                    <li>函数返回对象的内容，可以直接在模板中用</li>
                    <li>不能用this是underfined</li>
                    <li>在beforcreate之前调用，最早执行</li>
                </ul>
                <span>Setup和data,methods等等的区别，可以一块用，data，用this.可以访问setup里面的数据，但setup不能访问data里面的，因为data晚于setup执行</span>
                <div>------------------------------------------------</div>
                <div class="size_big">vite-plugin-vue-setup-extend 插件</div>
                <span>允许开发者在使用 Vue 3 的 script setup 语法糖时，能够直接为组件定义 name 属性。</span>
                <span>需在`vite.config.ts`配置，代码如下</span>
                <CodeBlock :code="codeBlock1" language="javascript" :show-run="true" @run="executeCode" />

                <span>Vue 版本低于 3.3时使用，从 Vue 3.3+ 版本开始，Vue 官方提供了 defineOptions 宏，同样可以用来定义组件名</span>

            </div>
            <div v-if="activeBoat?.id == 3">
                <div class="size_big">Ref（定义基本类型数据）</div>
                <div>
                    定义响应式变量，返回一个refimpl的实例对象，简称ref，ref对象的value属性是响应式的,
                    展示无需.value，改变数据需.value name.value == ‘xxx’
                </div>
                <div class="size_big">
                    Ref（定义对象类型响应数据）
                </div>
                <div>
                    Ref定义对象类型数据，想要改变需.value，底层逻辑还是通过Reactive进行proxy代理
                </div>
                <span class="size_big">-----------------示例代码--------------------</span>
                <CodeBlock :code="codeBlock2" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big"> Reactive（定义对象类型响应数据,只能定义对象类型响应数据）</div>
                <span>返回Proxy代理对象</span>
                <div class="refPic"></div>
                <div class="size_big">Ref对比reactive</div>
                <div>宏观：ref定义基本类型数据对象类型响应数据，reactive定义对象类型响应数据</div>
                <div>区别：ref创建的变量必须使用.value（可以使用volar插件自动添加.value）
                    reactive重新分配一个对象，会失去响应式（可以使用object.assign去整体替换）
                    有相同属性是替换没有是新增</div>
                <div class="size_big">-------示例代码---------</div>
                <CodeBlock :code="codeBlock3" language="javascript" :show-run="true" @run="executeCode" />
                <div>
                    Ref定义对象类型响应数据，该数据可以直接改</div>
                <div class="size_big">-------示例代码---------</div>

                <CodeBlock :code="codeBlock4" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">-------使用规程---------</div>

                <div>
                    <ul>
                        <li>定义一个基本类型响应式数据，ref</li>
                        <li>定义一个响应式对象，层级不深，ref,reactive都可</li>
                        <li>需要一个响应式对象，且层级深，reactive</li>
                    </ul>
                </div>
                <div class="size_big">-------toref和torefs---------</div>
                <div>这两个可以把响应式对象里面的数据结构成单个的拿出来，并且依旧具备响应式的能力</div>
                <div class="size_big">-------示例代码---------</div>

                <CodeBlock :code="codeBlock5" language="javascript" :show-run="true" @run="executeCode" />
                解构出来的数据是相通的
            </div>
            <div v-if="activeBoat?.id == 4">
                <div class="size_big">计算属性computed</div>
                <CodeBlock :code="codeBlock6" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">Watch</div>
                <span>V3只能监视以下四种数据</span>

                <div>
                    1.ref定义的数据。<br>
                    情况一：监视ref定义的基本数据类型
                </div>
                 
                <CodeBlock :code="codeBlock7" language="javascript" :show-run="true" @run="executeCode" />
                <div>情况二：监视ref定义的对象类型数据，监视的是对象的地址值，若想监视对象内部属性变化，需开启深度监听</div>
                 
                <CodeBlock :code="codeBlock8" language="javascript" :show-run="true" @run="executeCode" />
                <div>注意：若修改的是ref定义对象中的属性，newvalue和oldvalue都是新值，因为他们是同一个对象。 <br>
                    若修改整个ref定义的对象，newvalue是新增，oldvalue是旧值，因为不是一个对象了</div>
                <div>情况三：监视reactive定义的对象类型数据，默认开启深度监视（关不掉），且因为使用object.assign进行数据替换（操作的一直是原对象），所以数据地址没变，和ref不同</div>
                 
                <CodeBlock :code="codeBlock9" language="javascript" :show-run="true" @run="executeCode" />
                <div>情况四：监视ref或reactive定义的对象类型数据中某个对象，需注意<br>
                    1.若该属性不是对象类型，需写成函数形式<br>
                    2.若该属性值依然是对象类型，可直接编，也可写成函数，建议函数<br>
                    结论：监视的要是对象里的属性，最好写函数式，注意点：若对象监听的是地址值，需关注对象内部，需手动开启深度监听
                </div>
                 
                <CodeBlock :code="codeBlock10" language="javascript" :show-run="true" @run="executeCode" />
                <div>情况五：监视上述多个数据</div>
                 
                <CodeBlock :code="codeBlock11" language="javascript" :show-run="true" @run="executeCode" />
                <div>解除监视</div>
                 
                <CodeBlock :code="codeBlock12" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">WatchEffect</div>
                <div>
                    官网：立即运行一个函数，同时响应式的追踪其依赖，并在依赖更改时重新执行 <br>
                    Watch：需指出监视的数据<br>
                    WatchEffect：不用明确指出监视数据（函数中用到哪些数据，那就监视哪些数据）<br>
                </div>
                <CodeBlock :code="codeBlock13" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">生命周期 v3（使用生命周期需引入这些钩子）</div>
                <div class="smzq"></div>
            </div>
            <div v-if="activeBoat?.id == 5">
                <div>
                    创建路由步骤：<br>
                    安装路由：npm i vue-router<br>
                    创建组件，编写<br>
                    <CodeBlock :code="codeBlock14" language="javascript" :show-run="true" @run="executeCode" />
                    <div>注册挂载路由 main.ts</div>
                    <CodeBlock :code="codeBlock15" language="javascript" :show-run="true" @run="executeCode" />


                </div>
                <div class="size_big">路由两个注意点，以及to的两种写法</div>
                <div>
                    1. 路由组件通常存放在`pages` 或 `views`文件夹，一般组件通常存放在`components`文件夹。<br>
                    2. 通过点击导航，视觉效果上“消失” 了的路由组件，默认是被**卸载**掉的，需要的时候再去**挂载**。
                </div>
                <div class="router_pic"></div>
                <div class="size_big">两种路由工作模式，优缺点</div>
                <div>
                    1. `history`模式 <br>
                    优点：`URL`更加美观，不带有`#`，更接近传统的网站`URL`。<br>
                    缺点：后期项目上线，需要服务端配合处理路径问题，否则刷新会有`404`错误。<br>
                </div>

                <CodeBlock :code="codeBlock16" language="javascript" :show-run="true" @run="executeCode" />
                2. `hash`模式<br>
                优点：兼容性更好，因为不需要服务器端处理路径。<br>
                缺点：`URL`带有`#`不太美观，且在`SEO`优化方面相对较差。<br>
                <CodeBlock :code="codeBlock17" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">命名路由：</div>
                <CodeBlock :code="codeBlock18" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">嵌套路由：</div>

                <CodeBlock :code="codeBlock19" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">路由传参</div>
                <div>1.query传参</div>
                <div class="query_pic"></div>
                <div>接收参数：</div>
                 
                <CodeBlock :code="codeBlock20" language="javascript" :show-run="true" @run="executeCode" />
                <div>2.params传参,
                    路由需配置参数</div>
                 
                <CodeBlock :code="codeBlock21" language="javascript" :show-run="true" @run="executeCode" />
                  <div>传参方法</div>
                <div class="params_pic"></div>
                <div>接收参数：</div>
                <CodeBlock :code="codeBlock22" language="javascript" :show-run="true" @run="executeCode" />
                <div> 备注1：传递`params`参数时，若使用`to`的对象写法，必须使用`name`配置项，不能用`path`。<br>
                    备注2：传递`params`参数时，需要提前在规则中占位。</div>
                <div class="size_big">路由props配置:三种写法</div>
                <CodeBlock :code="codeBlock23" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">replace和push属性</div>
                <div>默认是push属性，点击路由浏览器有前进后退页面，replace属性浏览器不能前进或后退页面</div>
                <div> 1. 作用：控制路由跳转时操作浏览器历史记录的模式。<br>
                    2. 浏览器的历史记录有两种写入方式：分别为```push```和```replace```：<br>
                    - ```push```是追加历史记录（默认值）。<br>
                    - `replace`是替换当前记录。<br>
                    3. 开启`replace`模式：<br>
                    <div class="place_pic"></div>
                    <div class="size_big">编程式路由导航</div>
                     
                    <CodeBlock :code="codeBlock24" language="javascript" :show-run="true" @run="executeCode" />
                    <div class="size_big">路由重定向</div>

                    <CodeBlock :code="codeBlock25" language="javascript" :show-run="true" @run="executeCode" />

                </div>
            </div>
            <div v-if="activeBoat?.id == 6">
                <div class="size_big"> Pinia 是什么？与 Vuex 有什么区别？</div>
                <div> Pinia 是 Vue 官方推荐的状态管理库，专为 Vue 3Q设计，可视为 Vuex 的升级版。主要区别：</div>
                <ul>
                    <li>更简单的 API :移除了 mutations ，只有 state / getters / actions </li>
                    <li> TypeScript 支持：出色的类型推断</li>
                    <li>组合式 API ：完美配合 Vue 3的 Composition API </li>
                    <li>模块化：无需嵌套模块，每个 store 都是独立的,体积更小：比 Vuex 更轻量</li>
                </ul>
                <div class="size_big">为什么选择 Pinia 而不是 Vuex ?</div>
                <ul>
                    <li>官方推荐， Vue 核心团队维护 </li>
                    <li> 更符合 Vue 3的设计理念减少样板代码（无需 mutations )</li>
                    <li>更好的开发体验（自动补全园、类型检查） </li>
                    <li>支持服务端渲染（ SSR )</li>
                </ul>
                <div class="size_big">安装步骤</div>
                <div>1.安装pinia npm i pinia <br>
                    2.Main.ts 引入</div>
                <CodeBlock :code="codeBlock26" language="javascript" :show-run="true" @run="executeCode" />
                <div>存储+读取数据</div>
                <div>1. `Store`是一个保存：**状态**、**业务逻辑** 的实体，每个组件都可以**读取**、**写入**它。<br>

                    2. 它有三个概念：`state`、`getter`、`action`，相当于组件中的： `data`、 `computed` 和 `methods`。</div>
                <CodeBlock :code="codeBlock27" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">StoreToRefs</div>
                <div>
                    借助`storeToRefs`将`store`中的数据转为`ref`对象，方便在模板中使用。<br>
                    注意：`pinia`提供的`storeToRefs`只会将数据做转换，而`Vue`的`toRefs`会转换`store`中数据。
                </div>
                <CodeBlock :code="codeBlock28" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">getters</div>
                1. 概念：当`state`中的数据，需要经过处理后再使用时，可以使用`getters`配置。<br>

                2. 追加```getters```配置。
                <CodeBlock :code="codeBlock29" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">$subscribe</div>
                通过 store 的 `$subscribe()` 方法侦听 `state` 及其变化
                <CodeBlock :code="codeBlock30" language="javascript" :show-run="true" @run="executeCode" />

                <div class="size_big">store组合式写法</div>
                <CodeBlock :code="codeBlock31" language="javascript" :show-run="true" @run="executeCode" />
            </div>
            <div v-if="activeBoat?.id == 7">
                <div>**`Vue3`组件通信和`Vue2`的区别：** <br>
                    * 移出事件总线，使用`mitt`代替。<br>
                    - `vuex`换成了`pinia`。<br>
                    - 把`.sync`优化到了`v-model`里面了。<br>
                    - 把`$listeners`所有的东西，合并到`$attrs`中了。<br>
                    - `$children`被砍掉了。</div>
                <div class="size_big">1.props</div>
                <div>
                    概述：`props`是使用频率最高的一种通信方式，常用与 ：**父 ↔ 子**。 <br>

                    - 若 **父传子**：属性值是**非函数**。<br>
                    - 若 **子传父**：属性值是**函数**。
                </div>
                <img src="../../assets/images/props.png" alt="image-props" style="zoom:100%;">
                <div class="size_big">2.自定义事件</div>
                原生事件： <br>
                - 事件名是特定的（`click`、`mosueenter`等等） <br>
                - 事件对象`$event`: 是包含事件相关信息的对象（`pageX`、`pageY`、`target`、`keyCode`） <br>
                - 自定义事件： <br>
                - 事件名是任意名称 <br>
                - <strong style="color:red">事件对象`$event`: 是调用`emit`时所提供的数据，可以是任意类型！！！</strong>
                <img src="../../assets/images/zdy.png" alt="image-zdy" style="zoom:100%;">
                <div class="size_big">3.mitt</div>
                概述：与消息订阅与发布（`pubsub`）功能类似，可以实现任意组件间通信。
                 
                <CodeBlock :code="codeBlock32" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">4.v-model</div>
                 1. 概述：实现 **父↔子** 之间相互通信。<br>

                2. 前序知识 —— `v-model`的本质<br>
                <img src="../../assets/images/v-model.png" alt="image-model" style="zoom:100%;"><br>
                3. 组件标签上的`v-model`的本质：`:moldeValue` ＋ `update:modelValue`事件。<br>
                <img src="../../assets/images/mdel3.png" alt="image-mdel3" style="zoom:100%;"><br>
                4. 也可以更换`value`，例如改成`abc`<br>
                <img src="../../assets/images/model4.png" alt="image-model4" style="zoom:100%;"><br>
                5. 如果`value`可以更换，那么就可以在组件标签上多次使用`v-model`<br>
                <img src="../../assets/images/model5.png" alt="image-model5" style="zoom:100%;"><br>
                <div class="size_big">5.$attrs </div>
                1. 概述：`$attrs`用于实现**当前组件的父组件**，向**当前组件的子组件**通信（**祖→孙**）。<br>
                2. 具体说明：`$attrs`是一个对象，包含所有父组件传入的标签属性。<br>
                注意：`$attrs`会自动排除`props`中声明的属性(可以认为声明过的 `props` 被子组件自己“消费”了)<br>
                <img src="../../assets/images/arrts.png" alt="image-arrts" style="zoom:100%;"><br>
                <img src="../../assets/images/arrts1.png" alt="image-arrts1" style="zoom:100%;"><br>
                <div class="size_big">6.$refs、$parent</div>
                1. 概述：<br>
                * `$refs`用于 ：**父→子。**<br>
                * `$parent`用于：**子→父。**<br>
                2. 原理如下：<br>
                | `$refs` | 值为对象，包含所有被`ref`属性标识的`DOM`元素或组件实例。 |<br>
                | `$parent` | 值为对象，当前组件的父组件实例对象。 |<br>

                <div class="size_big">ref的使用</div>

                父组件：定义子组件ref，就可获取子组件实例，子组件需要将数据暴露出来供父组件使用
                <img src="../../assets/images/ref1.png" alt="image-ref1" style="zoom:100%;"><br>
                子组件：暴露数据 <br>
                <CodeBlock :code="codeBlock33" language="javascript" :show-run="true" @run="executeCode" />
                $ref：可以一次性获取全部子组件的ref<br>
                父组件：传递一个$ref<br>
                <img src="../../assets/images/ref2.png" alt="image-ref2" style="zoom:100%;"><br>
                子组件：暴露数据 <br>
                <CodeBlock :code="codeBlock34" language="javascript" :show-run="true" @run="executeCode" />
                $parent：子组件获取父组件值<br>
                子组件:<br>
                <img src="../../assets/images/parent.png" alt="image-parent" style="zoom:100%;"><br>
                父组件：暴露数据 <br>
                <CodeBlock :code="codeBlock35" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">7.provide、inject</div>
                1. 概述：实现**祖孙组件**直接通信<br>
                2. 具体使用：<br>
                * 在祖先组件中通过`provide`配置向后代组件提供数据<br>
                * 在后代组件中通过`inject`配置来声明接收数据<br>
                <img src="../../assets/images/provide.png" alt="image-provide" style="zoom:100%;"><br>
                <img src="../../assets/images/inject.png" alt="image-inject" style="zoom:100%;"><br>
                <div class="size_big">8.solt</div>
                <div class="size_big">默认插槽</div>
                <img src="../../assets/images/solt.png" alt="image-solt" style="zoom:100%;"><br>
                <div class="size_big">具名插槽</div>
                <img src="../../assets/images/solt1.png" alt="image-solt1" style="zoom:100%;"><br>
                <div class="size_big">作用域插槽</div>
                <div>
                    数据在子组件，但根据数据生成的结构在父组件使用作用域插槽<br>
                    父组件v-slot=""来接收子组件传来的数据
                </div>
                <img src="../../assets/images/solt2.png" alt="image-solt2" style="zoom:100%;"><br>
            </div>
            <div v-if="activeBoat?.id == 8">
                <div class="size_big">shallowRef和shallowReactive</div>
                <div>shallowRef作用：<br>
                    创建一个响应式数据，但只对顶层属性进行响应式处理。<br>
                    特点：只跟踪引用值的变化，不关心值内部的属性变化。</div>
                <CodeBlock :code="codeBlock36" language="javascript" :show-run="true" @run="executeCode" />
                <div>shallowReactive <br>
                    作用：创建一个浅层响应式对象，只会使对象的最顶层属性变成响应式的，对象内部的嵌套属性则不会变成响应式的。<br>
                    特点：对象的顶层属性是响应式的，但嵌套对象的属性不是。</div>
                <CodeBlock :code="codeBlock37" language="javascript" :show-run="true" @run="executeCode" />
                <div>总结：
                    通过使用shallowRef和shallowReactive来绕开深度响应。浅层式api创建的状态只在其顶层是响应式的。对所有深层的对象不会做任何处理，避免对每一个内部属性做响应式所带来的性能成本，这样使属性访问变的更快，可提升性能
                </div>
                <div class="size_big">readonly 与 shallowReadonly</div>
                <div>
                    readonly <br>
                    作用：用于创建一个对象的深只读副本。<br>
                    特点：<br>
                    * 对象的所有嵌套属性都将变为只读。<br>
                    * 任何尝试修改这个对象的操作都会被阻止（在开发模式下，还会在控制台中发出警告）。<br>
                    应用场景：<br>
                    * 创建不可变的状态快照。<br>
                    * 保护全局状态或配置不被修改。<br>
                </div>
                <CodeBlock :code="codeBlock38" language="javascript" :show-run="true" @run="executeCode" />
                <div>
                    shallowReadonly <br>
                    作用：与 `readonly` 类似，但只作用于对象的顶层属性。<br>
                    特点：<br>
                    * 只将对象的顶层属性设置为只读，对象内部的嵌套属性仍然是可变的。<br>
                    * 适用于只需保护对象顶层属性的场景。<br>

                </div>
                <CodeBlock :code="codeBlock39" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">toRaw 与 markRaw</div>
                <div>
                    toRaw<br>
                    作用：用于获取一个响应式对象的原始对象， `toRaw` 返回的对象不再是响应式的，不会触发视图更新。<br>
                    官网描述：这是一个可以用于临时读取而不引起代理访问/跟踪开销，或是写入而不触发更改的特殊方法。不建议保存对原始对象的持久引用，请谨慎使用。<br>
                    何时使用:在需要将响应式对象传递给非 `Vue` 的库或外部系统时，使用 `toRaw` 可以确保它们收到的是普通对象

                </div>
                <div>
                    markRaw <br>
                    作用：标记一个对象，使其**永远不会**变成响应式的。 <br>
                    例如使用`mockjs`时，为了防止误把`mockjs`变为响应式对象，可以使用 `markRaw` 去标记`mockjs`
                </div>
                <div class="size_big">customRef</div>
                <div>作用：创建一个自定义的`ref`，并对其依赖项跟踪和更新触发进行逻辑控制。(一般封装成hooks)<br>

                    实现防抖效果：</div>
                <CodeBlock :code="codeBlock40" language="javascript" :show-run="true" @run="executeCode" />
                <div class="size_big">Teleport</div>
                <div>Teleport 是一种能够将我们的**组件html结构**移动到指定位置的技术</div>
                <img src="../../assets/images/teleport.png" alt="image-Teleport" style="zoom:100%;"><br>
                <div class="size_big">Suspense</div>
                <div> 等待异步组件时渲染一些额外内容，当子组件有异步任务时，可以先展示默认内容 </div>
                <div>两个插槽：default和fallback，一个展示子组件，一个展示异步任务结束前默认内容</div>
                <img src="../../assets/images/suspense.png" alt="image-Suspense" style="zoom:100%;"><br>

            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import * as THREE from 'three'

// 小船数据结构
type Boat = {
    id: number  // 小船ID
    name: string           // 小船名称
    mesh: THREE.Mesh       // 小船网格
    shadow: THREE.Mesh     // 船底阴影网格
    baseX: number          // 初始 X 位置
    baseZ: number          // 初始 Z 位置
    phase: number          // 运动相位
    speed: number          // 运动速度
    ampX: number           // 横向摆动幅度
    ampZ: number           // 前后摆动幅度
    ampY: number           // 上下浮动幅度
}

// 页面容器引用
const containerRef = ref<HTMLDivElement | null>(null)
// 3D 画布容器引用
const canvasBoxRef = ref<HTMLDivElement | null>(null)

// 弹窗状态
const dialogVisible = ref(false)
// 当前命中船
const activeBoat = ref<Boat | null>(null)

// 提示状态
const tooltip = reactive({
    visible: false,
    x: 0,
    y: 0,
    name: ''
})

// Three.js 核心对象
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let raf = 0
let startTime = performance.now()

// 小船集合
const boats: Boat[] = []

// 鼠标归一化坐标
const pointer = new THREE.Vector2(-10, -10)
// 射线检测器
const raycaster = new THREE.Raycaster()

// 初始化 Three.js 渲染器、场景、相机
function initThree() {
    const box = canvasBoxRef.value
    if (!box) return

    const width = box.clientWidth
    const height = box.clientHeight

    // 创建透明渲染器
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    })

    // 限制像素比，兼顾性能
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 设置画布尺寸
    renderer.setSize(width, height)
    // 设置背景透明，不遮挡原有背景海浪
    renderer.setClearColor(0x000000, 0)

    // 挂载到容器
    box.appendChild(renderer.domElement)

    // 创建场景
    scene = new THREE.Scene()

    // 创建相机
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    // 设置相机位置
    camera.position.set(0, 4.5, 9)
    // 相机看向场景中心偏下，模拟海面视角
    camera.lookAt(0, 0.2, 0)
}

// 使用你提供的贴图方式创建小船材质
function createBoatMaterial() {
    // 创建纹理加载器
    const textureLoader = new THREE.TextureLoader()

    // 加载纹理
    const texture = textureLoader.load(`${import.meta.env.BASE_URL}ship.png`)

    // 将纹理颜色空间设置为 sRGB，颜色更准确
    texture.colorSpace = THREE.SRGBColorSpace

    // 加载透明度贴图，控制船体可见区域
    const alphaMap = textureLoader.load(`${import.meta.env.BASE_URL}shiptmd.png`)

    // 创建小船材质
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,     // 保持贴图原始颜色
        map: texture,        // 设置贴图
        alphaMap: alphaMap,  // 设置透明度贴图
        transparent: true,   // 允许透明
        depthWrite: false    // 关闭深度写入，避免透明物体遮挡异常
    })

    return material
}

// 创建船底阴影材质，使用径向渐变纹理实现柔和阴影
function createShadowMaterial() {
    // 创建离屏画布
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)

    // 中心偏深，边缘完全透明
    gradient.addColorStop(0, 'rgba(0,0,0,0.45)')
    gradient.addColorStop(0.55, 'rgba(0,0,0,0.18)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        opacity: 0.58
    })

    return material
}

// 添加多艘小船，并为每艘船添加船底阴影
function addBoats() {
    if (!scene) return

    const boatMaterial = createBoatMaterial()
    const shadowMaterial = createShadowMaterial()

    const configs = [
        { id: 1, name: 'OptionsAPI 与 CompositionAPI', x: -6, z: 3.4, y: 8, scale: 0.7, phase: 0.0 },
        { id: 2, name: 'setup', x: 1.8, z: 3.2, y: 1, scale: 0.92, phase: 1.1 },
        { id: 3, name: 'ref和reactive', x: -1, z: 3.9, y: 0, scale: 1.52, phase: 2.2 },
        { id: 4, name: 'computed和Watch，WatchEffect', x: 5.0, z: 2.8, y: 1, scale: 0.8, phase: 3.1 },
        { id: 5, name: '路由', x: -4, z: 5, y: 8, scale: 1, phase: 0.0 },
        { id: 6, name: 'Pinia', x: -3.8, z: 3, y: 1, scale: 0.92, phase: 1.1 },
        { id: 7, name: '组件通信', x: 3, z: 4.9, y: 0, scale: 1.2, phase: 2.2 },
        { id: 8, name: '其他api', x: 5.3, z: 4, y: 1, scale: 1, phase: 3.1 }
    ]

    for (const cfg of configs) {
        // 创建小船几何体
        const boatGeometry = new THREE.PlaneGeometry(1.5 * cfg.scale, 1.0 * cfg.scale)

        // 克隆材质，避免共享状态
        const boatMesh = new THREE.Mesh(boatGeometry, boatMaterial.clone())

        // 设置小船初始位置
        boatMesh.position.set(cfg.x, 0.35, cfg.z)

        // 面向相机
        boatMesh.lookAt(camera!.position)
        boatMesh.renderOrder = 2

        // 添加小船到场景
        scene!.add(boatMesh)

        // 创建船底阴影几何体
        const shadowGeometry = new THREE.PlaneGeometry(0.9 * cfg.scale, 0.4 * cfg.scale)

        // 创建阴影网格
        const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial.clone())

        // 设置阴影初始位置
        shadowMesh.position.set(cfg.x, 0.18, cfg.z)

        // 将阴影旋转为水平面，确保它始终落在背景之下
        shadowMesh.rotation.x = -Math.PI / 2
        shadowMesh.renderOrder = 1

        // 添加阴影到场景
        scene!.add(shadowMesh)

        // 创建小船数据对象
        const boat: Boat = {
            id: cfg.id,
            name: cfg.name,
            mesh: boatMesh,
            shadow: shadowMesh,
            baseX: cfg.x,
            baseZ: cfg.z,
            phase: cfg.phase,
            speed: 0.9 + Math.random() * 0.25,
            ampX: 0.28 + Math.random() * 0.18,
            ampZ: 0.18 + Math.random() * 0.14,
            ampY: 0.18 + Math.random() * 0.12
        }

        boats.push(boat)
    }
}

// 波浪高度采样，用于保持漂浮感
function waveOffsetY(x: number, z: number, time: number) {
    return (
        Math.sin(x * 1.4 + time * 1.1) * 0.22 +
        Math.sin(z * 1.0 + time * 0.8) * 0.16 +
        Math.sin((x + z) * 0.9 + time * 1.5) * 0.10
    )
}

// 适配渲染器和相机
function handleResize() {
    const box = canvasBoxRef.value
    if (!box || !renderer || !camera) return

    const width = box.clientWidth
    const height = box.clientHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
}

// 更新小船运动状态和船底阴影
function updateBoats(time: number) {
    for (const boat of boats) {
        // 水平摆动
        const x = boat.baseX + Math.sin(time * boat.speed + boat.phase) * boat.ampX

        // 前后摆动
        const z = boat.baseZ + Math.sin(time * boat.speed * 0.85 + boat.phase) * boat.ampZ

        // 跟随波浪上下浮动
        const y = 0.35 + waveOffsetY(boat.baseX, boat.baseZ, time) * 0.55 + Math.sin(time * boat.speed + boat.phase) * boat.ampY * 0.35

        // 计算海面基准高度
        const seaY = 0.35 + waveOffsetY(boat.baseX, boat.baseZ, time) * 0.55

        // 计算小船离海面高度
        const altitude = Math.max(y - seaY, 0)

        // 更新小船位置
        boat.mesh.position.set(x, y, z)

        // 始终面向相机
        boat.mesh.lookAt(camera!.position)

        // 增加轻微旋转，增强漂浮感
        boat.mesh.rotation.z = Math.sin(time * boat.speed * 0.8 + boat.phase) * 0.12

        // 更新船底阴影位置，始终贴在背景海面下面，避免与船体同层叠加
        boat.shadow.position.set(x, seaY - 0.06, z)

        // 随船离海面高度调整阴影大小
        const scaleFactor = 1 + altitude * 1.05

        // 随船离海面高度调整阴影透明度
        const opacityFactor = Math.max(1.62 - altitude * 0.05, 0.18)

        // 更新阴影缩放
        boat.shadow.scale.set(scaleFactor, 1, scaleFactor)

            // 更新阴影透明度
            ; (boat.shadow.material as THREE.MeshBasicMaterial).opacity = opacityFactor
    }
}

// 将页面坐标转为归一化设备坐标
function updatePointer(clientX: number, clientY: number) {
    const box = canvasBoxRef.value
    if (!box) return

    const rect = box.getBoundingClientRect()
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
}

// 命中检测
function hitBoat(): Boat | null {
    if (!camera || !scene) return null

    raycaster.setFromCamera(pointer, camera)

    const meshes = boats.map(b => b.mesh)
    const hits = raycaster.intersectObjects(meshes, false)

    if (hits.length > 0) {
        const hitMesh = hits[0].object as THREE.Mesh
        return boats.find(b => b.mesh === hitMesh) ?? null
    }

    return null
}

// 显示提示
function showTooltip(clientX: number, clientY: number, boat: Boat) {
    const box = canvasBoxRef.value
    if (!box) return

    const rect = box.getBoundingClientRect()
    const localX = clientX - rect.left
    const localY = clientY - rect.top

    tooltip.visible = true
    tooltip.name = boat.name
    tooltip.x = Math.min(localX + 16, rect.width - 180)
    tooltip.y = Math.max(localY - 54, 8)
}

// 鼠标移动事件
function onPointerMove(event: PointerEvent) {
    updatePointer(event.clientX, event.clientY)
    const boat = hitBoat()

    if (boat) {
        showTooltip(event.clientX, event.clientY, boat)
    } else {
        tooltip.visible = false
    }
}

// 鼠标离开事件
function onPointerLeave() {
    pointer.set(-10, -10)
    tooltip.visible = false
}

// 鼠标点击事件
function onClick(event: MouseEvent) {
    updatePointer(event.clientX, event.clientY)
    const boat = hitBoat()

    if (boat) {
        activeBoat.value = boat
        dialogVisible.value = true
    }
}

// 主渲染循环
function animate() {
    const time = (performance.now() - startTime) / 1000

    updateBoats(time)

    if (renderer && scene && camera) {
        renderer.render(scene, camera)
    }

    raf = requestAnimationFrame(animate)
}

// 绑定交互事件
function bindEvents() {
    window.addEventListener('resize', handleResize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('click', onClick)
}

// 解绑交互事件
function unbindEvents() {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerleave', onPointerLeave)
    window.removeEventListener('click', onClick)
}

// 组件挂载
onMounted(() => {
    initThree()
    addBoats()
    bindEvents()
    animate()
})

// 组件卸载
onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    unbindEvents()

    // 释放渲染器
    renderer?.dispose()
    renderer?.domElement.remove()

    // 释放小船和阴影资源
    for (const boat of boats) {
        boat.mesh.geometry.dispose()
            ; (boat.mesh.material as THREE.Material).dispose()

        boat.shadow.geometry.dispose()
            ; (boat.shadow.material as THREE.Material).dispose()
    }
})
/////代码块
import CodeBlock from '../../components/CodeBlock .vue'

const executeCode = () => {
}

const codeBlock1 = `

                    import { defineConfig } from 'vite'
                    import VueSetupExtend from 'vite-plugin-vue-setup-extend'
                    export default defineConfig({
                    plugins: [ VueSetupExtend() ]
                    })
                
`
const codeBlock2 = `

            let car ref({
            carName : 'nn',
            price: 100,
            bb:{
            cc: 50
            }
            })
            function onchange(){
            name.value = 'abc'
            car.value.bb.cc = 45
            }
        
`
const codeBlock3 = `

            let game = reactive({
            wz: '1',
            xt: '2'
            })
            function changeGame(){
            game = {a:'a'} //这样写页面不更新，相当于把数据替换掉，不是响应式
            game = reactive({a: 'a'}) //这样写相当于换了一个数据
            Object.assign(game,{
            wz: '11',
            xt: '22' ,
            a:'a'
            })
            }
        
`
const codeBlock4 = `


            let sun = ref({
              wz: '1',
              xt: '2'
            })
            function changeSun(){
              sun.value = {
              wz: '1',
              xt: '2'
            }
            }
        
`
const codeBlock5 = `


            let game = reactive({
              wz: '1',
              xt: '2'
            })
            let {wz,xt} = toRefs(game)   //解构所有的
            let wzone = toRef(game,'wz') //解构指定的
        
`
const codeBlock6 = `

            // 计算属性——既读取又修改
            let fullName = computed({
            // 读取
            get(){
            return firstName.value + '-' + lastName.value
            },
            // 修改
            set(val){
            console.log('有人修改了fullName',val)
            firstName.value = val.split('-')[0]
            lastName.value = val.split('-')[1]
            }
            })

            function changeFullName(){
            fullName.value = 'li-si'
            }
        
`
const codeBlock7 = `

                      let sum = ref(0)

            watch(sum,(newValue,oldValue) =>{ //sum监听的值，后面值变后的回调函数
              console.log(newValue,oldValue)
            })
                    
`
const codeBlock8 = `

                      let sums = ref({
              a:0,
              b:1
            })

             watch(sums,(newValue,oldValue) =>{
              console.log(newValue,oldValue)
             
            },{
              deep:true , //深度监视
              immediate: true //立即监视
            })
                    
`
const codeBlock9 = `

            let person = reactive({
            name:'张三',
            age:18
            })
                      watch(person,(newValue,oldValue)=>{
            console.log('person变化了',newValue,oldValue)
            })
                    
`
const codeBlock10 = `

                      et sums = reactive({
              a:0,
              b:1,
              c: {
                d:3,
                f:6
              }
            })

             watch(()=> sums.a,(newValue,oldValue) =>{
              console.log(newValue,oldValue)
             
            })
            function changeName(){
              sums.c = {d:31,
                f:3}
            }

            watch(sums.c,(newValue,oldValue) =>{
              console.log(newValue,oldValue)    //监视的是对象类型可以直接写,最好写函数形式，
            直接写，监视不到整体变化，可监视到单个变化，如改d改f，
            改整体的c监视不到，如changeName 这样，原因是替换掉了数组地址
            ，但是写函数形式可以监听到整体，监听不到单个的，这种情况需
            手动打开深度监听
             
            },{
              deep:true
            }
            )
                    
`
const codeBlock11 = `

                      watch([()=>sums.c,()=> sums.a],(newValue,oldValue) =>{
              console.log(newValue,oldValue)    
              //打印出来是监视两个值拼一起的数组
            },{
              deep:true
            })
                    
`
const codeBlock12 = `

                      let sum = ref(0)

            const stopWatvh =  watch(sum,(newValue,oldValue) =>{ //sum监听的值，后面值变后的回调函数
              console.log(newValue,oldValue)
              if (newValue > 10) {
                stopWatvh()  //停止监视
              }
            })
                    
`
const codeBlock13 = `

            watchEffect(() => {
              if (sum.value > 10 || sums.a < 20) {     stopWatvh()  //停止监视   } })         </code>
    </pre>

        </cardDialog>
        <cardDialog :title="'标签Ref和生命周期'">
            <div class="size_big">ref</div>
            <pre><code class="language-javascript">
              div ref="title"> /div
            import {ref,computed,watch, reactive,watchEffect} from 'vue'
            let title = ref() //title就是定义的ref
            console.log(title.value)
                    
`
const codeBlock14 = `

                //创建一个路由
                //1.引入createRouter
                import { createRouter,createWebHashHistory  } from "vue-router";
                //引入组件页面
                import home from '@view/home/index'
                import three from '@view/three/index'

                //2.创建路由
                const router = createRouter({
                    history:createWebHashHistory(), //路由器的工作模式
                    routes: [
                        {    //一个个路由
                            path: '/home',
                            component: home
                        },
                        {
                            path: '/three',
                            component: three
                        }
                    ]
                })
                //暴露路由
                export default router
                        
`
const codeBlock15 = `

                import './assets/main.css'

                import { createApp } from 'vue'
                import App from './App.vue'
                //引入路由
                import  router  from "./router";
                //创建一个应用
                const app = createApp(App)
                //引用路由
                app.use(router)
                //挂载应用到app
                app.mount('#app')
                        
`
const codeBlock16 = `

            const router = createRouter({
            history:createWebHistory(), //history模式
            })
        
`
const codeBlock17 = `

            const router = createRouter({
            history:createWebHashHistory(), //hash模式
            /******/
            })
        
`
const codeBlock18 = `

            {    //一个路由
                        name:'shouye',
                        path: '/home',
                        component: home
                    },
        
`
const codeBlock19 = `

             {    //一个路由
                        name:'shouye',
                        path: '/home',
                        component: home,
                        children :[{ //子路由
                            name: 'body',
                            path: 'body',
                            component: body,
                        }]
                    },
        
`
const codeBlock20 = `

             import { useRoute } from "vue-router";
                const router = useRoute()
                //打印query参数
                console.log(router.query);
                    
`
const codeBlock21 = `

             children :[{ //子路由
                            name: 'body',
                            path: 'body/:a/:b',  //如果不缺定是否要传参     body/:a?/:b?    后面需加问号
                            component: body,
                        }]
                    
`
const codeBlock22 = `

            import { useRoute } from "vue-router";
                const router = useRoute()
                //打印query参数
                console.log(router.params);
                    
`
const codeBlock23 = `

            children :[{ //子路由
                            name: 'body',
                            path: 'body/:a/:b',  //如果不缺定是否要传参     body/:a?/:b?    后面需加问号
                            component: body,
                            props: true      //第一种写法，将路由收到的所以params参数作为props传给路由
                            props(route){        //第二种写法，可以决定自己将什么作为props给路由组件
                                return route.query //或者route.params
                            }    
                             props:{                   //第三种写法，将值写死
                                    a:100,
                                    b:100,
                             }
                        }]
                    
`
const codeBlock24 = `

                import { useRouter} from "vue-router";
                const router = useRouter()
                function tiaozhuan() {
                router.push('/home/body')
                    //或 router.replace('/home/body')
                }
                //传参
                function tiaozhuan() {
                    router.push({
                        name: 'body',
                        query:{
                            a: a.value,
                            b: b.value
                        }
                    })
                }
                        
`
const codeBlock25 = `

                {
                            path: '/',
                            redirect: '/home' //默认进来的页面
                        }
                        
`
const codeBlock26 = `

            //创建一个应用
            const app = createApp(App)
            //引入pinia
            import {createPinia} from 'pinia'
            //创建pinia
            const pinai = createPinia()
            //安装pinia
            app.use(pinai)
                    
`
const codeBlock27 = `


            import { defineStore } from "pinia";
            //存数据
            export const namePinia = defineStore('name',{
                state() {
                    return{
                        name: '3245'
                    }
                }
            })
            //取数据
                import { namePinia } from "@/store/three";
                const nameStore = namePinia()
            nameStore.name

            //修改
            //第一种
                nameStore.name = 'asdsf'
                //第二中 $patch批量修改
                nameStore.$patch({
                    name: 'adwfqw',
                    num: 12
            })
            export const namePinia = defineStore('name',{
                //第三种，actions里面写方法，适用于复用
                actions: {
                    add(){
                        this.num += 1
                    }
                },
                state() {
                    return{
                        name: '3245',
                        num : 2
                    }
                }
            })

            //直接调用
                nameStore.add()

                    
`
const codeBlock28 = `

            import { useCountStore } from '@/store/count'
            /* 引入storeToRefs */
            import { storeToRefs } from 'pinia'
            /* 得到countStore */
            const countStore = useCountStore()
            /* 使用storeToRefs转换countStore，随后解构 */
            const {sum} = storeToRefs(countStore)
                    
`
const codeBlock29 = `

            // 引入defineStore用于创建store
            import {defineStore} from 'pinia'

            // 定义并暴露一个store
            export const useCountStore = defineStore('count',{
            // 动作
            actions:{
            /************/
            },
            // 状态
            state(){
            return {
            sum:1,
            school:'atguigu'
            }
            },
            // 计算
            getters:{
            bigSum:(state):number => state.sum *10,
            upperSchool():string{
            return this. school.toUpperCase()
            }
            }
            })
            \`\`\`

            3. 组件中读取数据：

            \`\`\`js
            const {increment,decrement} = countStore
            let {sum,school,bigSum,upperSchool} = storeToRefs(countStore)
            \`\`\`
                    
`
const codeBlock30 = `

            talkStore.$subscribe((mutate,state)=>{
            console.log('LoveTalk',mutate,state)
            localStorage.setItem('talk',JSON.stringify(talkList.value))
            })
        
`
const codeBlock31 = `

            import {defineStore} from 'pinia'
            import axios from 'axios'
            import {nanoid} from 'nanoid'
            import {reactive} from 'vue'

            export const useTalkStore = defineStore('talk',()=>{
            // talkList就是state
            const talkList = reactive(
            JSON.parse(localStorage.getItem('talkList') as string) || []
            )

            // getATalk函数相当于action
            async function getATalk(){
            // 发请求，下面这行的写法是：连续解构赋值+重命名
            let {data:{content:title}} = await axios.get('https://api.uomg.com/api/rand.qinghua?format=json')
            // 把请求回来的字符串，包装成一个对象
            let obj = {id:nanoid(),title}
            // 放到数组中
            talkList.unshift(obj)
            }
            return {talkList,getATalk}
            })
        
`
const codeBlock32 = `

            安装\`mitt\`

            \`\`\`shell
            npm i mitt
            \`\`\`

            新建文件：\`src\\utils\\emitter.ts\`

            \`\`\`javascript
            // 引入mitt
            import mitt from "mitt";

            // 创建emitter
            const emitter = mitt()

            /*
            // 绑定事件
            emitter.on('abc',(value)=>{
            console.log('abc事件被触发',value)
            })
            emitter.on('xyz',(value)=>{
            console.log('xyz事件被触发',value)
            })

            setInterval(() => {
            // 触发事件
            emitter.emit('abc',666)
            emitter.emit('xyz',777)
            }, 1000);

            setTimeout(() => {
            // 清理事件
            emitter.all.clear()
            }, 3000);
            */

            // 创建并暴露mitt
            export default emitter
            \`\`\`

            接收数据的组件中：绑定事件、同时在销毁前解绑事件：

            \`\`\`typescript
            import emitter from "@/utils/emitter";
            import { onUnmounted } from "vue";

            // 绑定事件
            emitter.on('send-toy',(value)=>{
            console.log('send-toy事件被触发',value)
            })

            onUnmounted(()=>{
            // 解绑事件
            emitter.off('send-toy')
            })
            \`\`\`【第三步】：提供数据的组件，在合适的时候触发事件

            \`\`\`javascript
            import emitter from "@/utils/emitter";

            function sendToy(){
            // 触发事件
            emitter.emit('send-toy',toy.value)
            }
            **注意这个重要的内置关系，总线依赖着这个内置关系**
                    
`
const codeBlock33 = `

            const a = 23
            const b = 24
            defineExpose({a,b})
                    
`
const codeBlock34 = `

            const a = 23
            const b = 24
            defineExpose({a,b})
                    
`
const codeBlock35 = `

              const aa = ref(1)
                const bb = ref(1)
                const cc = ref(1)
            defineExpose({aa,bb,cc})
                    
`
const codeBlock36 = `


            let sum = shallowRef(1)
            let person = shallowRef({
            name: 'lis',
            age: 12
            })

            function change(){
            sum.value = 2 //.value属于第一层 只有对 .value 的访问是响应式的。
            person.value.age = 20 //.value.age属于第二层不做响应
            }
        
`
const codeBlock37 = `

            let person = shallowReactive({
            two: 12,
            one: {
            name: 'lis',
            age: 12
            }
            })

            function change() {
            只有根级别的属性是响应式的。属性的值会被原样存储和暴露，这也意味着值为 ref 的属性不会被自动解包了。
            person.two = 2 //属于第一层
            Object.assign( person.one,{ //属于第一层,整体替换是会响应的
            name: 'edsd',
            age: 23
            })

            person.one.age = 20 //属于第二层不做响应
            }

        
`
const codeBlock38 = `

            let sum1 = ref(0)
            let sum2 = readonly(sum1)
            function changeSum1(){
            sum1.value += 1 //修改sum1，sum2也会跟着变化
            }
            function changeSum2(){
            sum2.value += 1 //sum2是不能修改的
            }

        
`
const codeBlock39 = `

            let car1 = reactive({
            brand:'奔驰',
            options:{
            color:'红色',
            price:100
            }
            })
            let car2 = shallowReadonly(car1)
            function changeBrand2(){
            car2.brand = '宝马' //shallowReadonly只保护浅层，不能修改
            }
            function changeColor2(){
            car2.options.color = '绿色' //深层可以修改
            }
            function changePrice2(){
            car2.options.price += 10
            }

        
`
const codeBlock40 = `

                 import {customRef } from "vue";
            export default function(initValue:string,delay:number){
            let msg = customRef((track,trigger)=>{
            let timer:number
            return {
            get(){ //数据被读取时调用
            track() // 告诉Vue数据msg很重要，要对msg持续关注，一旦变化就更新
            return initValue
            },
            set(value){ //数据被改变时调用
            clearTimeout(timer)
            timer = setTimeout(() => {
            initValue = value
            trigger() //通知Vue数据msg变化了
            }, delay);
            }
            }
            })
            return {msg}
            }
            
        
`
</script>

<style scoped>
/* 页面容器 */
.sea-scene {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
}

/* 原有内容层 */
.sea-scene__content {
    position: relative;
    z-index: 1;
    padding: 16px;
}

/* 3D 小船只画布区域，不新建海浪 */
.sea-overlay-box {
    position: fixed;
    right: 0;
    top: 18vh;
    z-index: 2;
    width: 100vw;
    height: 82vh;
    border-radius: 12px;
    overflow: hidden;
    pointer-events: none;
}

/* 鼠标提示 */
.sea-tooltip {
    position: fixed;
    z-index: 3;
    max-width: 180px;
    padding: 10px 12px;
    color: #0f172a;
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(148, 163, 184, 0.35);
    border-radius: 10px;
    box-shadow: 0 10px 24px rgba(2, 6, 23, 0.12);
    pointer-events: none;
}

/* 提示标题 */
.sea-tooltip__name {
    font-weight: 600;
}

/* 提示说明 */
.sea-tooltip__tip {
    margin-top: 4px;
    color: #475569;
    font-size: 12px;
}

/* 弹窗行样式 */
.sea-dialog__row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
}

/* 最后一行无分隔线 */
.sea-dialog__row:last-child {
    border-bottom: 0;
}

/* 标签颜色 */
.sea-dialog__row span {
    color: #64748b;
}
</style>
