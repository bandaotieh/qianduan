
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
            <div v-if="activeBoat?.id == 1">
                 1. TypeScript 由微软开发，是基于 JavaScript 的⼀个扩展语⾔。<br>
            2. TypeScript 包含了 JavaScript 的所有内容，即： TypeScript 是 JavaScrip
            t 的超集。<br>
            3. TypeScript 增加了：静态类型检查、接⼝、 泛型等很多现代开发特性，更适合⼤型项⽬<br>
            的开发。
            4. TypeScript 需要编译为 JavaScript ，然后交给浏览器或其他 JavaScript 运⾏环
            境执⾏。
            </div>
        <div v-if="activeBoat?.id == 2">
             <div class="size_big">1. 命令⾏编译</div>
            <div>要把 .ts ⽂件编译为 .js ⽂件，需要配置 TypeScript 的编译环境，步骤如下：</div>
            <ul>
                <li>第⼀步：创建⼀个 demo.ts ⽂件，例如：</li>
                <CodeBlock :code="codeBlock1" language="javascript" :show-run="true" @run="executeCode" />
                <li>第⼆步：全局安装 TypeScript</li>
                <CodeBlock :code="codeBlock2" language="javascript" :show-run="true" @run="executeCode" />

                <li>第三步：使⽤命令编译 .ts ⽂件</li>
                <CodeBlock :code="codeBlock3" language="javascript" :show-run="true" @run="executeCode" />

            </ul>

            <div class="size_big">2.⾃动化编译</div>

            <ul>
                <li>第⼀步：创建 TypeScript 编译控制⽂件</li>
                <CodeBlock :code="codeBlock4" language="javascript" :show-run="true" @run="executeCode" />
                <div>1. ⼯程中会⽣成⼀个 tsconfig.json 配置⽂件，其中包含着很多编译时的配置。<br>
                    2. 观察发现，默认编译的 JS 版本是 ES7 ，我们可以⼿动调整为其他版本。</div>
                <li>第⼆步：监视⽬录中的 .ts ⽂件变化</li>
                <CodeBlock :code="codeBlock5" language="javascript" :show-run="true" @run="executeCode" />

                <li>第三步：⼩优化，当编译出错时不⽣成 .js ⽂件</li>
                <CodeBlock :code="codeBlock6" language="javascript" :show-run="true" @run="executeCode" />
                <div>备注：当然也可以修改 tsconfig.json 中的 noEmitOnError 配置</div>

            </ul>
            </div>
        <div v-if="activeBoat?.id == 3">
             <div class="size_big">类型声明</div>
            使⽤ : 来对变量或函数形参，进⾏类型声明：

            <CodeBlock :code="codeBlock7" language="javascript" :show-run="true" @run="executeCode" />
            在 : 后也可以写字⾯量类型，不过实际开发中⽤的不多。
            <CodeBlock :code="codeBlock8" language="javascript" :show-run="true" @run="executeCode" />
            <div class="size_big"> 类型推断</div>
            TS 会根据我们的代码，进⾏类型推导，例如下⾯代码中的变量 d ，只能存储数字
            <CodeBlock :code="codeBlock9" language="javascript" :show-run="true" @run="executeCode" />
            但要注意，类型推断不是万能的，⾯对复杂类型时推断容易出问题，所以尽量还是明确的编写类
            型声明！
            <div class="size_big">类型总览</div>
            js 中的数据类型<br>
            <img src="../../assets/images/JS.png" alt="image-JS" style="zoom:100%;"><br>
            TS 中的数据类型<br>
            <img src="../../assets/images/TS.png" alt="image-TS" style="zoom:100%;"><br>
            <div style="color: red;">注意点！</div>
            <div>在 JavaScript 中的这些内置构造函数： Number 、 String 、 Boolean ，⽤于
                创建对应的包装对象， 在⽇常开发时很少使⽤，在 TypeScript 中也是同理，所以
                在 TypeScript 中进⾏类型声明时，通常都是⽤⼩写的 number 、 string 、 bo
                olean
                例如下⾯代码：
                <CodeBlock :code="codeBlock10" language="javascript" :show-run="true" @run="executeCode" />
                <div>
                    <div style="font-weight: 600;"> 1. 原始类型 VS 包装对象</div>
                    <span style="font-weight: 600;">原始类型：</span>
                    <span>如 number 、 string 、 boolean ，在 JavaScript 中是简单数据
                        类型，它们在内存中占⽤空间少，处理速度快。<br>
                        <span style="font-weight: 600;"> 包装对象：</span>
                        如 Number 对象、 String 对象、 Boolean 对象，是复杂类型，在
                        内存中占⽤更多空间，在⽇常开发时很少由开发⼈员⾃⼰创建包装对象。</span><br>
                    <span style="font-weight: 600;">2. ⾃动装箱：</span>
                    JavaScript 在必要时会⾃动将原始类型包装成对象，以便调⽤⽅法或访
                    问属性
                </div>

            </div>
            <CodeBlock :code="codeBlock11" language="javascript" :show-run="true" @run="executeCode" />
            </div>
               <div v-if="activeBoat?.id == 4">
<div class="size_big">1.any</div>
            <div>any 的含义是：任意类型，⼀旦将变量类型限制为 any ，那就意味着放弃了对该变量的类型
                检查。</div>
            <CodeBlock :code="codeBlock12" language="javascript" :show-run="true" @run="executeCode" />

            <div>注意点： any 类型的变量，可以赋值给任意类型的变量</div>
            <CodeBlock :code="codeBlock13" language="javascript" :show-run="true" @run="executeCode" />



            <div class="size_big">2.unknown</div>
            <div>unknown 的含义是：未知类型，适⽤于：起初不确定数据的具体类型，要后期才能确定</div>
            <div>1. unknown 可以理解为⼀个类型安全的 any 。</div>
            <CodeBlock :code="codeBlock14" language="javascript" :show-run="true" @run="executeCode" />
            <div>2. unknown 会强制开发者在使⽤之前进⾏类型检查，从⽽提供更强的类型安全性。</div>

            <CodeBlock :code="codeBlock15" language="javascript" :show-run="true" @run="executeCode" />
            <div>3. 读取 any 类型数据的任何属性都不会报错，⽽ unknown 正好与之相反。</div>
            <CodeBlock :code="codeBlock16" language="javascript" :show-run="true" @run="executeCode" />


            <div class="size_big">1.any</div>
            <CodeBlock :code="codeBlock17" language="javascript" :show-run="true" @run="executeCode" />
            <div>注意点： any 类型的变量，可以赋值给任意类型的变量</div>
            <CodeBlock :code="codeBlock18" language="javascript" :show-run="true" @run="executeCode" />




            <div class="size_big">3.never</div>
            <div>never 的含义是：任何值都不是，即：不能有值，例如 undefined 、 nul
                l 、 '' 、 0 都不⾏！</div>
            <div>never 的含义是：任何值都不是，即：不能有值，例如 undefined 、 nul
                l 、 '' 、 0 都不⾏！
                1. ⼏乎不⽤ never 去直接限制变量，因为没有意义，例如：</div>
            <CodeBlock :code="codeBlock19" language="javascript" :show-run="true" @run="executeCode" />
            <div>2. never ⼀般是 TypeScript 主动推断出来的，例如：</div>

            <CodeBlock :code="codeBlock20" language="javascript" :show-run="true" @run="executeCode" />
            <div>3. never 也可⽤于限制函数的返回值(主要限制直接抛出异常的函数，或一直循环的函数)</div>
            <CodeBlock :code="codeBlock21" language="javascript" :show-run="true" @run="executeCode" />

            <div class="size_big">4.void</div>
            <div>void 的含义是空，即：函数不返回任何值，调⽤者也不应依赖其返回值进⾏任何操作！</div>
            <div>1. void 通常⽤于函数返回值声明</div>
            <CodeBlock :code="codeBlock22" language="javascript" :show-run="true" @run="executeCode" />
            <div style="color: red;">注意：编码者没有编写 return 指定函数返回值，所以 logMessage 函数是没有显式
                返回值的，但会有⼀个隐式返回值 ，是 undefined ，虽然函数返回类型为 void ，但
                也是可以接受 undefined 的，简单记： undefined 是 void 可以接受的⼀种“空”。</div>
            <div>2. 以下写法均符合规范</div>
            <CodeBlock :code="codeBlock23" language="javascript" :show-run="true" @run="executeCode" />
            <div>3. 那限制函数返回值时，是不是 undefined 和 void 就没区别呢？—— 有区别。因为还有
                这句话 ：【返回值类型为 void 的函数，调⽤者不应依赖其返回值进⾏任何操作！】对⽐下
                ⾯两段代码：</div>
            <CodeBlock :code="codeBlock24" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">理解 void 与 undefined</div>
            <div>void 是⼀个⼴泛的概念，⽤来表达“空”，⽽ undefined 则是这种“空”的具体
                实现。<br>
                因此可以说 undefined 是 void 能接受的⼀种“空”的状态。<br>
                也可以理解为： void 包含 undefined ，但 void 所表达的语义超越了 undefi
                ned ， void 是⼀种意图上的约定，⽽不仅仅是特定值的限制。</div>
            <div style="font-weight: 600;">总结：</div>
            <div>如果⼀个函数返回类型为 void ，那么：<br>
                1. 从语法上讲：函数是可以返回 undefined 的，⾄于显式返回，还是隐式返回，这⽆
                所谓！<br>
                2. 从语义上讲：函数调⽤者不应关⼼函数返回的值，也不应依赖返回值进⾏任何操作！
                即使我们知道它返回了 undefined 。</div>


            <div class="size_big">5.object</div>
            <div>关于 object 与 Object ：实际开发中⽤的相对较少，因为范围太⼤了。</div>
            <div style="color: red;">object（⼩写）</div>
            <div>object （⼩写）的含义是：所有⾮原始类型，可存储：对象、函数、数组等，由于限制
                的范围⽐较宽泛，在实际开发中使⽤的相对较少。</div>
            <CodeBlock :code="codeBlock25" language="javascript" :show-run="true" @run="executeCode" />
            <div style="color: blue;">Object（大写）</div>
            <div>官⽅描述：所有可以调⽤ Object ⽅法的类型。 <br>
                简单记忆：除了 undefined 和 null 的任何值。 <br>
                由于限制的范围实在太⼤了！所以实际开发中使⽤频率极低。</div>
            <CodeBlock :code="codeBlock26" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">声明对象类型</div>
            <div>1. 实际开发中，限制⼀般对象，通常使⽤以下形式</div>
            <CodeBlock :code="codeBlock27" language="javascript" :show-run="true" @run="executeCode" />
            <div>2. 索引签名： 允许定义对象可以具有任意数量的属性，这些属性的键和类型是可变的，
                常⽤于：描述类型不确定的属性，（具有动态属性的对象）。</div>

            <CodeBlock :code="codeBlock28" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">声明函数类型</div>

            <CodeBlock :code="codeBlock29" language="javascript" :show-run="true" @run="executeCode" />
            <div>
                备注：<br>
                TypeScript 中的 => 在函数类型声明时表示函数类型，描述其参数类型和返回类
                型。<br>
                JavaScript 中的 => 是⼀种定义函数的语法，是具体的函数实现。<br>
                函数类型声明还可以使⽤：接⼝、⾃定义类型等⽅式，下⽂中会详细讲解。
            </div>
            <div style="font-weight: 600;">声明数组类型</div>
            <CodeBlock :code="codeBlock30" language="javascript" :show-run="true" @run="executeCode" />

            <div class="size_big">6.tuple</div>
            元组 (Tuple) 是⼀种特殊的数组类型，可以存储固定数量的元素，并且每个元素的类型是已
            知的且可以不同。元组⽤于精确描述⼀组值的类型， ? 表示可选元素。
            <CodeBlock :code="codeBlock31" language="javascript" :show-run="true" @run="executeCode" />



            <div>

                <div class="size_big">7.enum</div>
                枚举（ enum ）可以定义⼀组命名常量，它能增强代码的可读性，也让代码更好维护。
                <div>如下代码的功能是：根据调⽤ walk 时传⼊的不同参数，执⾏不同的逻辑，存在的问题是调⽤ w
                    alk 时传参时没有任何提示，编码者很容易写错字符串内容；并且⽤于判断逻辑的 up 、 dow
                    n 、 left 、 right 是连续且相关的⼀组值，那此时就特别适合使⽤ 枚举（ enum ）。</div>
                <CodeBlock :code="codeBlock32" language="javascript" :show-run="true" @run="executeCode" />
                <div style="font-weight: 600;">1. 数字枚举</div>
                <div>数字枚举⼀种最常⻅的枚举类型，其成员的值会⾃动递增，且数字枚举还具备反向映射的
                    特点，在下⾯代码的打印中，不难发现：可以通过值来获取对应的枚举成员名称 。</div>
                <CodeBlock :code="codeBlock33" language="javascript" :show-run="true" @run="executeCode" />
                也可以指定枚举成员的初始值，其后的成员值会⾃动递增。
                <CodeBlock :code="codeBlock34" language="javascript" :show-run="true" @run="executeCode" />
                <div>使⽤数字枚举完成刚才 walk 函数中的逻辑，此时我们发现： 代码更加直观易读，⽽且类
                    型安全，同时也更易于维护</div>
                <CodeBlock :code="codeBlock35" language="javascript" :show-run="true" @run="executeCode" />
                <div style="font-weight: 600;">2. 字符串枚举</div>
                <div>枚举成员的值是字符串</div>
                <CodeBlock :code="codeBlock36" language="javascript" :show-run="true" @run="executeCode" />
                <div style="font-weight: 600;">3. 常量枚举</div>
                <div><span style="font-weight:600;">官⽅描述：</span>常量枚举是⼀种特殊枚举类型，它使⽤ const 关键字定义，在编译时会被
                    内联，避免⽣成⼀些额外的代码。</div>
                <div>何为编译时内联？ <br>
                    所谓“内联”其实就是 TypeScript 在编译时，会将枚举成员引⽤替换为它们的实际值，
                    ⽽不是⽣成额外的枚举对象。这可以减少⽣成的 JavaScript 代码量，并提⾼运⾏时性
                    能。</div>
                <div>使⽤普通枚举的 TypeScript 代码如下：</div>

                <CodeBlock :code="codeBlock37" language="javascript" :show-run="true" @run="executeCode" />
                <div>编译后⽣成的 JavaScript 代码量较⼤ ：</div>
                <CodeBlock :code="codeBlock38" language="javascript" :show-run="true" @run="executeCode" />
                <div>使⽤常量枚举的 TypeScript 代码如下：</div>
                <CodeBlock :code="codeBlock39" language="javascript" :show-run="true" @run="executeCode" />
                <div>编译后⽣成的 JavaScript 代码量较⼩：</div>
                <CodeBlock :code="codeBlock40" language="javascript" :show-run="true" @run="executeCode" />
            </div>

            <div>
                <div class="size_big">8.typr</div>
                <div>type 可以为任意类型创建别名，让代码更简洁、可读性更强，同时能更⽅便地进⾏类型复⽤和
                    扩展。</div>
                <div>
                    <div style="font-weight: 600;">1. 基本⽤法</div>
                    <div>类型别名使⽤ type 关键字定义， type 后跟类型名称，例如下⾯代码中 num 是类
                        型别名。</div>
                    <CodeBlock :code="codeBlock41" language="javascript" :show-run="true" @run="executeCode" />
                    <div style="font-weight: 600;">2. 联合类型</div>
                    <div>联合类型是⼀种⾼级类型，它表示⼀个值可以是⼏种不同类型之⼀。</div>
                    <CodeBlock :code="codeBlock42" language="javascript" :show-run="true" @run="executeCode" />
                </div>
                <div style="font-weight: 600;">3.交叉类型</div>
                <div>交叉类型（Intersection Types）允许将多个类型合并为⼀个类型。合并后的类型将拥
                    有所有被合并类型的成员。交叉类型通常⽤于对象类型。</div>
                <CodeBlock :code="codeBlock43" language="javascript" :show-run="true" @run="executeCode" />
            </div>
            <div>
                <div class="size_big">9. ⼀个特殊情况</div>
                <div style="font-weight: 600;">代码段1（正常）</div>
                <div>在函数定义时，限制函数返回值为 void ，那么函数的返回值就必须是空。</div>
                <CodeBlock :code="codeBlock44" language="javascript" :show-run="true" @run="executeCode" />
                <div style="font-weight: 600;">代码段2（特殊）</div>
                <div>
                    使⽤<span style="color: red;">类型声明</span> 限制函数返回值为 void 时，<span style="color: red;"> TypeScript
                        并不会严格要求函数返回空。</span>
                </div>
                <CodeBlock :code="codeBlock45" language="javascript" :show-run="true" @run="executeCode" />
                <div style="font-weight: 600;">为什么会这样？</div>
                <div>是为了确保如下代码成⽴，我们知道 Array.prototype.push 的返回值是⼀个数字，
                    ⽽ Array.prototype.forEach ⽅法期望其回调的返回类型是 void 。</div>
                <CodeBlock :code="codeBlock46" language="javascript" :show-run="true" @run="executeCode" />
                <a style="width: 100%;"
                    href="https://www.typescriptlang.org/docs/handbook/2/functions.html#assignability-of-functions">官⽅⽂档的说明</a>

            </div>
            </div>
               <div v-if="activeBoat?.id == 5">
<img src="../../assets/images/shuxing.png" alt="image-shuxing" style="zoom:100%;"><br>
            <div style="font-weight: 600;">public 修饰符</div>
            <CodeBlock :code="codeBlock47" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">属性的简写形式</div>
            <CodeBlock :code="codeBlock48" language="javascript" :show-run="true" @run="executeCode" />

            <div style="font-weight: 600;">protected 修饰符</div>
            <CodeBlock :code="codeBlock49" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">private 修饰符</div>
            <CodeBlock :code="codeBlock50" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">readonly 修饰符</div>
            <CodeBlock :code="codeBlock51" language="javascript" :show-run="true" @run="executeCode" />
            </div>
               <div v-if="activeBoat?.id == 6">
<div style="background-color: antiquewhite;padding: 1vw;text-align: left;">
                <span style="font-weight: 600;">概述：</span>
                抽象类是⼀种⽆法被实例化的类，专⻔⽤来定义类的结构和⾏为，类中可以写抽象
                ⽅法，也可以写具体实现。抽象类主要⽤来为其派⽣类提供⼀个基础结构，要求其派⽣类
                必须实现其中的抽象⽅法。<br>
                <span style="font-weight: 600;">简记：</span>
                抽象类不能实例化，其意义是可以被继承，抽象类⾥可以有普通⽅法、也可以有抽
                象⽅法。
            </div>
            <div style="font-weight: 600;">通过以下场景，理解抽象类：</div>
            <div>我们定义⼀个抽象类 Package ，表示所有包裹的基本结构，任何包裹都有重量属性 weight
                ，包裹都需要计算运费。但不同类型的包裹（如：标准速度、特快专递）都有不同的运费计算
                ⽅式，因此⽤于计算运费的
                calculate ⽅法是⼀个抽象⽅法，必须由具体的⼦类来实现。</div>
            <CodeBlock :code="codeBlock52" language="javascript" :show-run="true" @run="executeCode" />
            <div>StandardPackage 类继承了 Package ，实现了 calculate ⽅法：</div>
            <CodeBlock :code="codeBlock53" language="javascript" :show-run="true" @run="executeCode" />
            <div>ExpressPackage 类继承了 Package ，实现了 calculate ⽅法：</div>
            <CodeBlock :code="codeBlock54" language="javascript" :show-run="true" @run="executeCode" />
            <img src="../../assets/images/chouxiang.png" alt="chouxiang" style="zoom:100%;">
            </div>
               <div v-if="activeBoat?.id == 7">
<div style="background-color: antiquewhite;padding: 1vw;text-align: left;">
                interface 是⼀种定义结构的⽅式，主要作⽤是为：类、对象、函数等规定⼀种契约，这样
                可以确保代码的⼀致性和类型安全，但要注意 interface 只能定义格式，不能包含任何实
                现 ！
            </div>
            <div style="font-weight: 600;">定义类结构</div>
            <CodeBlock :code="codeBlock55" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">定义对象结构</div>
            <CodeBlock :code="codeBlock56" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">定义函数结构</div>
            <CodeBlock :code="codeBlock57" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">接⼝之间的继承</div>
            <div>⼀个 interface 继承另⼀个 interface ，从⽽实现代码的复⽤</div>
            <CodeBlock :code="codeBlock58" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">接⼝⾃动合并（可重复定义）</div>
            <CodeBlock :code="codeBlock59" language="javascript" :show-run="true" @run="executeCode" />
            <img src="../../assets/images/jiekou.png" alt="jiekou" style="zoom:100%;">

            </div>
               <div v-if="activeBoat?.id == 8">
<div style="font-weight: 600;">interface 与 type的区别</div>
            <div style="background-color: antiquewhite;padding: 1vw;text-align: left;">
                相同点： interface 和 type 都可以⽤于定义对象结构，在定义对象结构时两者可以
                互换。<br>
                不同点：<br>
                1️⃣ interface ：更专注于定义对象和类的结构，⽀持继承、合并。<br>
                2️⃣ type ：可以定义类型别名、联合类型、交叉类型，但不⽀持继承和⾃动合并。
            </div>
            <CodeBlock :code="codeBlock60" language="javascript" :show-run="true" @run="executeCode" />

            <div style="font-weight: 600;">interface 与 抽象类的区别</div>
            <div style="background-color: antiquewhite;padding: 1vw;text-align: left;">
                相同点：都能定义⼀个类的格式（定义类应遵循的契约）<br>
                不相同：<br>
                1️⃣ 接⼝：只能描述结构，不能有任何实现代码，⼀个类可以实现多个接⼝。<br>
                2️⃣ 抽象类：既可以包含抽象⽅法，也可以包含具体⽅法， ⼀个类只能继承⼀个抽象类。
            </div>
            <CodeBlock :code="codeBlock61" language="javascript" :show-run="true" @run="executeCode" />
            </div>
             <div v-if="activeBoat?.id == 9">
 <div>泛型允许我们在定义函数、类或接⼝时，使⽤类型参数来表示未指定的类型，这些参数在具体
                使⽤时，才被指定具体的类型，泛型能让同⼀段代码适⽤于多种类型，同时仍然保持类型的安
                全性。</div>
            <div>举例：如下代码中 T 就是泛型，（不⼀定⾮叫 T ），设置泛型后即可在函数中使⽤ T 来表
                示该类型：</div>
            <div>泛型函数</div>
            <CodeBlock :code="codeBlock62" language="javascript" :show-run="true" @run="executeCode" />
            <div>泛型可以有多个</div>
            <CodeBlock :code="codeBlock63" language="javascript" :show-run="true" @run="executeCode" />
            <div>泛型接⼝</div>
            <CodeBlock :code="codeBlock64" language="javascript" :show-run="true" @run="executeCode" />
            <div>泛型约束</div>
            <CodeBlock :code="codeBlock65" language="javascript" :show-run="true" @run="executeCode" />
            <div>泛型类</div>
            <CodeBlock :code="codeBlock66" language="javascript" :show-run="true" @run="executeCode" />
            </div>
             <div v-if="activeBoat?.id == 10">
 <div>类型声明⽂件是 TypeScript 中的⼀种特殊⽂件，通常以 .d.ts 作为扩展名。它的主要作⽤
                是为现有的 JavaScript 代码提供类型信息，使得 TypeScript 能够在使⽤这些 JavaScript 库
                或模块时进⾏类型检查和提示。</div>
            <div>demo.js</div>
            <CodeBlock :code="codeBlock67" language="javascript" :show-run="true" @run="executeCode" />
            <div>demo.d.ts</div>
            <CodeBlock :code="codeBlock68" language="javascript" :show-run="true" @run="executeCode" />
            <div>index.ts</div>
            <CodeBlock :code="codeBlock69" language="javascript" :show-run="true" @run="executeCode" />
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
        { id: 1, name: 'TS简介', x: -6, z: 3.4, y: 8, scale: 0.7, phase: 0.0 },
        { id: 2, name: '编译TS', x: 1.8, z: 3.2, y: 1, scale: 0.92, phase: 1.1 },
        { id: 3, name: '类型', x: -1.5, z: 4.5, y: 0, scale: 1.52, phase: 2 },
        { id: 4, name: '类型总览', x: 5.0, z: 2.8, y: 1, scale: 0.8, phase: 3.1 },
        { id: 5, name: '属性修饰符', x: -4, z: 5, y: 8, scale: 1, phase: 0.0 },
        { id: 6, name: '抽象类', x: -3.8, z: 3, y: 1, scale: 0.92, phase: 1.1 },
        { id: 7, name: 'interface（接⼝）', x: 3, z: 4.9, y: 0, scale: 1.2, phase: 2.2 },
        { id: 8, name: '一些相似的概念', x: 5.3, z: 4, y: 1, scale: 1, phase: 3.1 },
        { id: 9, name: '泛型', x: 1.5, z: 4.3, y: 0, scale: 1.2, phase: 1.8 },
        { id: 3, name: '类型声明⽂件', x: 0, z: 2.9, y: 0, scale: 1, phase: 2 },


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

                    const person = {
                  name:'李四',
                  age:18
                    }
                console.log(\`我叫\${person.name}，我今年\${person.age}岁了\`)
                
`
const codeBlock2 = `

                    npm i typescript -g
                
`
const codeBlock3 = `

                   tsc demo.ts
                
`
const codeBlock4 = `

              tsc --init
                
`
const codeBlock5 = `

                   tsc --watch 或 tsc -w
                
`
const codeBlock6 = `

                 tsc --noEmitOnError --watch
                
`
const codeBlock7 = `

                   let a: string //变量a只能存储字符串
let b: number //变量b只能存储数值
let c: boolean //变量c只能存储布尔值
a = 'hello'
a = 100 //警告：不能将类型“number”分配给类型“string”
b = 666
b = '你好'//警告：不能将类型“string”分配给类型“number”
c = true
c = 666 //警告：不能将类型“number”分配给类型“boolean”
// 参数x必须是数字，参数y也必须是数字，函数返回值也必须是数字
function demo(x:number,y:number):number{
 return x + y
}
demo(100,200)
demo(100,'200') //警告：类型“string”的参数不能赋给类型“number”的参数
demo(100,200,300) //警告：应有 2 个参数，但获得 3 个
demo(100) //警告：应有 2 个参数，但获得 1 个
                
`
const codeBlock8 = `

let a: '你好' //a的值只能为字符串“你好”
let b: 100 //b的值只能为数字100
a = '欢迎'//警告：不能将类型“"欢迎"”分配给类型“"你好"”
b = 200 //警告：不能将类型“200”分配给类型“100”
                
`
const codeBlock9 = `

                let d = -99 //TypeScript会推断出变量d的类型是数字
d = false //警告：不能将类型“boolean”分配给类型“number”
                
`
const codeBlock10 = `

                let str1: string
str1 = 'hello'
str1 = new String('hello') //报错
let str2: String
str2 = 'hello'
str2 = new String('hello')
console.log(typeof str1)
console.log(typeof str2)
                
`
const codeBlock11 = `

                    // 原始类型字符串
let str = 'hello';
// 当访问str.length时，JavaScript引擎做了以下⼯作：
let size = (function() {
 // 1. ⾃动装箱：创建⼀个临时的String对象包装原始字符串
 let tempStringObject = new String(str);
 // 2. 访问String对象的length属性
 let lengthValue = tempStringObject.length;
 // 3. 销毁临时对象，返回⻓度值
 // （JavaScript引擎⾃动处理对象销毁，开发者⽆感知）
 return lengthValue;
})();
console.log(size); // 输出: 5
                
`
const codeBlock12 = `

    // 明确的表示a的类型是 any —— 【显式的any】
let a: any
// 以下对a的赋值，均⽆警告
a = 100
a = '你好'
a = false
// 没有明确的表示b的类型是any，但TS主动推断出来b是any —— 隐式的any
let b
//以下对b的赋值，均⽆警告
b = 100
b = '你好'
b = false
                
`
const codeBlock13 = `

                /* 注意点：any类型的变量，可以赋值给任意类型的变量 */
let c:any
c = 9
let x: string
x = c // ⽆警告
                
`
const codeBlock14 = `

                // 设置a的类型为unknown
let a: unknown
//以下对a的赋值，均符合规范
a = 100
a = false
a = '你好'
// 设置x的数据类型为string
let x: string
x = a //警告：不能将类型“unknown”分配给类型“string”
                
`
const codeBlock15 = `

    // 设置a的类型为unknown
let a: unknown
a = 'hello'
//第⼀种⽅式：加类型判断
if(typeof a === 'string'){
 x = a
 console.log(x)
}
//第⼆种⽅式：加断⾔
x = a as string
//第三种⽅式：加断⾔

x = < string>a
                
`
const codeBlock16 = `

    let str1: string
str1 = 'hello'
str1.toUpperCase() //⽆警告
let str2: any
str2 = 'hello'
str2.toUpperCase() //⽆警告
let str3: unknown
str3 = 'hello';
str3.toUpperCase() //警告：“str3”的类型为“未知”
// 使⽤断⾔强制指定str3的类型为string
(str3 as string).toUpperCase() //⽆警告
                
`
const codeBlock17 = `

                
`
const codeBlock18 = `

                
`
const codeBlock19 = `

                never 的含义是：任何值都不是，即：不能有值，例如 undefined 、 nul
l 、 '' 、 0 都不⾏！
1. ⼏乎不⽤ never 去直接限制变量，因为没有意义，例如：
/* 指定a的类型为never，那就意味着a以后不能存任何的数据了 */
let a: never
// 以下对a的所有赋值都会有警告
a = 1
a = true
a = undefined
a = null
                
`
const codeBlock20 = `

                    // 指定a的类型为string
let a: string
// 给a设置⼀个值
a = 'hello'
if (typeof a === 'string') {
 console.log(a.toUpperCase())
} else {
 console.log(a) // TypeScript会推断出此处的a是never，因为没有任何⼀个值符合此处的
逻辑
}
                
`
const codeBlock21 = `

    // 限制throwError函数不需要有任何返回值，任何值都不⾏，像undeifned、null都不⾏
function throwError(str: string): never {
 throw new Error('程序异常退出:' + str)
}
                
`
const codeBlock22 = `

                function logMessage(msg:string):void{
 console.log(msg)
}
logMessage('你好')
                
`
const codeBlock23 = `

    // ⽆警告
function logMessage(msg:string):void{
 console.log(msg)
}
// ⽆警告
function logMessage(msg:string):void{
 console.log(msg)
 return;
}
// ⽆警告
function logMessage(msg:string):void{
 console.log(msg)
 return undefined
}
                
`
const codeBlock24 = `

    function logMessage(msg:string):void{
 console.log(msg)
}
let result = logMessage('你好')
if(result){ // 此⾏报错：⽆法测试 "void" 类型的表达式的真实性
 console.log('logMessage有返回值')
}
function logMessage(msg:string):undefined{
 console.log(msg)
}
let result = logMessage('你好')
if(result){ // 此⾏⽆警告
 console.log('logMessage有返回值')
}
                
`
const codeBlock25 = `

    let a:object //a的值可以是任何【⾮原始类型】，包括：对象、函数、数组等
// 以下代码，是将【⾮原始类型】赋给a，所以均符合要求
a = {}
a = {name:'张三'}
a = [1,3,5,7,9]
a = function(){}
a = new String('123')
class Person {}
a = new Person()
// 以下代码，是将【原始类型】赋给a，有警告
a = 1 // 警告：不能将类型“number”分配给类型“object”
a = true // 警告：不能将类型“boolean”分配给类型“object”
a = '你好' // 警告：不能将类型“string”分配给类型“object” 
a = null // 警告：不能将类型“null”分配给类型“object”
a = undefined // 警告：不能将类型“undefined”分配给类型“object”
                
`
const codeBlock26 = `

                let b:Object //b的值必须是Object的实例对象（除去undefined和null的任何值）
// 以下代码，均⽆警告，因为给a赋的值，都是Object的实例对象
b = {}
b = {name:'张三'}
b = [1,3,5,7,9]
b = function(){}
b = new String('123')
class Person {}
b = new Person()
b = 1 // 1不是Object的实例对象，但其包装对象是Object的实例
b = true // truue不是Object的实例对象，但其包装对象是Object的实例
b = '你好' // “你好”不是Object的实例对象，但其包装对象是Object的实例
// 以下代码均有警告
b = null // 警告：不能将类型“null”分配给类型“Object”
b = undefined // 警告：不能将类型“undefined”分配给类型“Object”
                
`
const codeBlock27 = `

    // 限制person1对象必须有name属性，age为可选属性
let person1: { name: string, age?: number }
// 含义同上，也能⽤分号做分隔
let person2: { name: string; age?: number }
// 含义同上，也能⽤换⾏做分隔
let person3: {
 name: string
 age?: number
}
// 如下赋值均可以
person1 = {name:'李四',age:18}
person2 = {name:'张三'}
person3 = {name:'王五'}
// 如下赋值不合法，因为person3的类型限制中，没有对gender属性的说明
person3 = {name:'王五',gender:'男'}
                
`
const codeBlock28 = `

    // 限制person对象必须有name属性，可选age属性但值必须是数字，同时可以有任意数
量、任意类型的其他属性
let person: {
 name: string
 age?: number
 [key: string]: any // 索引签名，完全可以不⽤key这个单词，换成其他的也可以
}
// 赋值合法
person = {
 name:'张三',
 age:18,
 gender:'男'
}
                
`
const codeBlock29 = `

    let count: (a: number, b: number) => number
count = function (x, y) {
 return x + y
}
                
`
const codeBlock30 = `

    let arr1: string[]
let arr2: Array< string>
arr1 = ['a','b','c']
arr2 = ['hello','world']
                
`
const codeBlock31 = `

                // 第⼀个元素必须是 string 类型，第⼆个元素必须是 number 类型。
let arr1: [string,number]
// 第⼀个元素必须是 number 类型，第⼆个元素是可选的，如果存在，必须是 boolean 类型。
let arr2: [number,boolean?]
// 第⼀个元素必须是 number 类型，后⾯的元素可以是任意数量的 string 类型
let arr3: [number,...string[]]
// 可以赋值
arr1 = ['hello',123]
arr2 = [100,false]
arr2 = [200]
arr3 = [100,'hello','world']
arr3 = [100]
// 不可以赋值，arr1声明时是两个元素，赋值的是三个
arr1 = ['hello',123,false]
                
`
const codeBlock32 = `

                function walk(str:string) {
 if (str === 'up') {
 console.log("向【上】⾛");
 } else if (str === 'down') {
 console.log("向【下】⾛");
 } else if (str === 'left') {
 console.log("向【左】⾛");
 } else if (str === 'right') {
 console.log("向【右】⾛");
 } else {
 console.log("未知⽅向");
 }
}
walk('up')
walk('down')
walk('left')
walk('right')
                
`
const codeBlock33 = `

    // 定义⼀个描述【上下左右】⽅向的枚举Direction
enum Direction {
 Up,
 Down,
 Left,
 Right
}
console.log(Direction) // 打印Direction会看到如下内容
/* 
 {
 0:'Up', 
 1:'Down', 
 2:'Left', 
 3:'Right', 
 Up:0, 
 Down:1, 
 Left:2,
 Right:3
 } 
*/
// 反向映射
console.log(Direction.Up)
console.log(Direction[0])
// 此⾏代码报错，枚举中的属性是只读的
Direction.Up = 'shang'
                
`
const codeBlock34 = `

                    enum Direction {
 Up = 6,
 Down,
 Left,
 Right
}
console.log(Direction.Up); // 输出: 6
console.log(Direction.Down); // 输出: 7
                
`
const codeBlock35 = `

    enum Direction {
 Up,
 Down,
 Left,
 Right,
}
function walk(n: Direction) {
 if (n === Direction.Up) {
 console.log("向【上】⾛");
 } else if (n === Direction.Down) {
 console.log("向【下】⾛");
 } else if (n === Direction.Left) {
 console.log("向【左】⾛");
 } else if (n === Direction.Right) {
 console.log("向【右】⾛");
 } else {
 console.log("未知⽅向");
 }
}
walk(Direction.Up)
walk(Direction.Down)
                
`
const codeBlock36 = `

    enum Direction {
 Up = "up",
 Down = "down",
 Left = "left",
 Right = "right"
}
let dir: Direction = Direction.Up;
console.log(dir); // 输出: "up"
                
`
const codeBlock37 = `

    enum Directions {
 Up,
 Down,
 Left,
 Right
}
let x = Directions.Up;
                
`
const codeBlock38 = `

                    "use strict";
var Directions;
(function (Directions) {
 Directions[Directions["Up"] = 0] = "Up";
 Directions[Directions["Down"] = 1] = "Down";
 Directions[Directions["Left"] = 2] = "Left";
 Directions[Directions["Right"] = 3] = "Right";
})(Directions || (Directions = {}));
let x = Directions.Up;
                
`
const codeBlock39 = `

    const enum Directions {
 Up,
 Down,
 Left,
 Right
}
let x = Directions.Up;
                
`
const codeBlock40 = `

                    "use strict";
let x = 0 /* Directions.Up */;
                
`
const codeBlock41 = `

    type num = number;
let price: num
price = 100
                
`
const codeBlock42 = `

                    type Status = number | string
type Gender = '男' | '⼥'
function printStatus(status: Status) {
 console.log(status);
}
function logGender(str:Gender){
 console.log(str)
}
printStatus(404);
printStatus('200');
printStatus('501');
logGender('未知') //报错

logGender('男')
logGender('⼥')
                
`
const codeBlock43 = `

    //⾯积
type Area = {
 height: number; //⾼
 width: number; //宽
};
//地址
type Address = {
 num: number; //楼号
 cell: number; //单元号
 room: string; //房间号
};
// 定义类型House，且House是Area和Address组成的交叉类型
type House = Area & Address;
const house: House = {
 height: 180,
 width: 75,
 num: 6,
 cell: 3,
 room: '702'
};
                
`
const codeBlock44 = `

            function demo():void{
 // 返回undefined合法
 return undefined
 // 以下返回均不合法
 return 100
 return false
 return null
 return []
}
demo()
                
`
const codeBlock45 = `

    type LogFunc = () => void
const f1: LogFunc = () => {
 return 100; // 允许返回⾮空值
};
const f2: LogFunc = () => 200; // 允许返回⾮空值
const f3: LogFunc = function () {
 return 300; // 允许返回⾮空值
};
                
`
const codeBlock46 = `

    const src = [1, 2, 3];
const dst = [0];
src.forEach((el) => dst.push(el));
                
`
const codeBlock47 = `

                //Person 类--------------
                class Person {
 // name写了public修饰符，age没写修饰符，最终都是public修饰符
 public name: string
 age: number
 constructor(name: string, age: number) {
 this.name = name
 this.age = age
 }
 speak() {
 // 类的【内部】可以访问public修饰的name和age
 console.log(\`我叫：\${this.name}，今年\${this.age}岁\`)
 }
}
const p1 = new Person('张三', 18)
// 类的【外部】可以访问public修饰的属性
console.log(p1.name)


//Student 继承 Person--------------------
class Student extends Person {
 constructor(name: string, age: number) {
 super(name, age)
 }
 study() {
 // 【⼦类中】可以访问⽗类中public修饰的：name属性、age属性
 console.log(\`\${this.age}岁的\${this.name}正在努⼒学习\`)
 }
}
                
`
const codeBlock48 = `

                //完整写法--------------------
                          class Person {
 public name: string;
 public age: number;
 constructor(name: string, age: number) {
 this.name = name;
 this.age = age;
 }
}
//简写形式-----------------------
class Person {
 constructor(
 public name: string,
 public age: number
 ) { }
}
                
`
const codeBlock49 = `

                //Person类-----------------
                class Person {
 // name和age是受保护属性，不能在类外部访问，但可以在【类】与【⼦类】中访问
 constructor(
 protected name: string,
 protected age: number
 ) {}
 // getDetails是受保护⽅法，不能在类外部访问，但可以在【类】与【⼦类】中访问
 protected getDetails(): string {
 // 类中能访问受保护的name和age属性
 return \`我叫：\${this.name}，年龄是：\${this.age}\`
 }
 // introduce是公开⽅法，类、⼦类、类外部都能使⽤
 introduce() {
 // 类中能访问受保护的getDetails⽅法
 console.log(this.getDetails());
 }
}
const p1 = new Person('杨超越',18)
// 可以在类外部访问introduce
p1.introduce()
// 以下代码均报错
// p1.getDetails()
// p1.name
// p1.age



//Student 继承 Person-------------------------
class Student extends Person {
 constructor(name:string,age:number){
 super(name,age)
 }
 study(){
 // ⼦类中可以访问introduce
 this.introduce()
 // ⼦类中可以访问name
 console.log(\`\${this.name}正在努⼒学习\`)
 }
}
const s1 = new Student('tom',17)
s1.introduce()
                
`
const codeBlock50 = `

                class Person {
 constructor(
 public name: string,
 public age: number,
 // IDCard属性为私有的(private)属性，只能在【类内部】使⽤
 private IDCard: string
 ) { }
 private getPrivateInfo(){
 // 类内部可以访问私有的(private)属性 —— IDCard
 return \`身份证号码为：\${this.IDCard}\`
 }
 getInfo() {
 // 类内部可以访问受保护的(protected)属性 —— name和age
 return \`我叫: \${this.name}, 今年刚满\${this.age}岁\`;
 }
 getFullInfo(){
 // 类内部可以访问公开的getInfo⽅法，也可以访问私有的getPrivateInfo⽅法
 return this.getInfo() + '，' + this.getPrivateInfo()
 }
}
const p1 = new Person('张三',18,'110114198702034432')
console.log(p1.getFullInfo())
console.log(p1.getInfo())
// 以下代码均报错
// p1.name
// p1.age
// p1.IDCard
// p1.getPrivateInfo()
                
`
const codeBlock51 = `

    class Car {
 constructor(
 public readonly vin: string, //⻋辆识别码，为只读属性
 public readonly year: number,//出⼚年份，为只读属性
 public color: string,
 public sound: string
 ) { }
 // 打印⻋辆信息
 displayInfo() {
 console.log(\`
 识别码：\${this.vin},
 出⼚年份：\${this.year},
 颜⾊：\${this.color},
 ⾳响：\${this.sound}
 \`);
 }
}
const car = new Car('1HGCM82633A123456', 2018, '⿊⾊', 'Bose⾳响');
car.displayInfo()
// 以下代码均错误：不能修改 readonly 属性
// car.vin = '897WYE87HA8SGDD8SDGHF'; 
// car.year = 2020;
                
`
const codeBlock52 = `

Package 类------------------
    abstract class Package {
 constructor(public weight: number) { }
 // 抽象⽅法：⽤来计算运费，不同类型包裹有不同的计算⽅式
 abstract calculate(): number
 // 通⽤⽅法：打印包裹详情
 printPackage() {
 console.log(\`包裹重量为: \${this.weight}kg，运费为: \${this.calculate()}元\`);
 }
}
                
`
const codeBlock53 = `

                    StandardPackage 类 （标快包裹）---------------------
                    // 标准包裹
class StandardPackage extends Package {
 constructor(
 weight: number,
 public unitPrice: number // 每公⽄的固定费率
 ) { super(weight) }
 // 实现抽象⽅法：计算运费
 calculate(): number {
 return this.weight * this.unitPrice;
 }
}
// 创建标准包裹实例
const s1 = new StandardPackage(10,5)
s1.printPackage()
                
`
const codeBlock54 = `

                    ExpressPackage 类（特快包裹）-------------------------
                    class ExpressPackage extends Package {
 constructor(
 weight: number,
 private unitPrice: number, // 每公⽄的固定费率（快速包裹更⾼）
 private additional: number // 超出10kg以后的附加费
 ) { super(weight) }
 // 实现抽象⽅法：计算运费
 calculate(): number {
 if(this.weight > 10){
 // 超出10kg的部分，每公⽄多收additional对应的价格
 return 10 * this.unitPrice + (this.weight - 10) * this.additional
 }else {
 return this.weight * this.unitPrice;
 }
 }
}
// 创建特快包裹实例
const e1 = new ExpressPackage(13,8,2)
e1.printPackage()
                
`
const codeBlock55 = `

                // PersonInterface接⼝，⽤与限制Person类的格式
interface PersonInterface {
 name: string
 age: number
 speak(n: number): void
}
// 定义⼀个类 Person，实现 PersonInterface 接⼝
class Person implements PersonInterface {
 constructor(
 public name: string,
 public age: number
 ) { }
 // 实现接⼝中的 speak ⽅法
 speak(n: number): void {
 for (let i = 0; i < n; i++) {
 // 打印出包含名字和年龄的问候语句
 console.log(\`你好，我叫\${this.name}，我的年龄是\${this.age}\`);
 }
 }
}
// 创建⼀个 Person 类的实例 p1，传⼊名字 'tom' 和年龄 18
const p1 = new Person('tom', 18);
p1.speak(3)
                
`
const codeBlock56 = `

                interface UserInterface {
 name: string
 readonly gender: string // 只读属性
 age?: number // 可选属性
 run: (n: number) => void
}
const user: UserInterface = {
 name: "张三",
 gender: '男',
 age: 18,
 run(n) {
 console.log(\`奔跑了\${n}⽶\`)
 }
};
                
`
const codeBlock57 = `

                interface CountInterface {
 (a: number, b: number): number;
}
const count: CountInterface = (x, y) => {
 return x + y
}
                
`
const codeBlock58 = `

                interface PersonInterface {
 name: string // 姓名
 age: number // 年龄
}
interface StudentInterface extends PersonInterface {
 grade: string // 年级
}
const stu: StudentInterface = {
 name: "张三",
 age: 25,
 grade: '⾼三',
}
                
`
const codeBlock59 = `

    // PersonInterface接⼝
interface PersonInterface {
 // 属性声明
 name: string
 age: number
}
// 给PersonInterface接⼝添加新属性
interface PersonInterface {
 // ⽅法声明
 speak(): void
}
// Person类实现PersonInterface
class Person implements PersonInterface {
 name: string
 age: number
 // 构造器
 constructor(name: string, age: number) {
 this.name = name
 this.age = age
 }
 // ⽅法
 speak() {
 console.log('你好！我是⽼师:', this.name)
 }
}
                
`
const codeBlock60 = `

                interface 和 type 都可以定义对象结构----------------
                // 使⽤ interface 定义 Person 对象
interface PersonInterface {
 name: string;
 age: number;
 speak(): void;
}
// 使⽤ type 定义 Person 对象
type PersonType = {
 name: string;
 age: number;
 speak(): void;
};
// 使⽤PersonInterface
/* let person: PersonInterface = {
 name:'张三',
 age:18,
 speak(){
 console.log(\`我叫：\${this.name}，年龄：\${this.age}\`)
 }
} */
// 使⽤PersonType
let person: PersonType = {
 name:'张三',
 age:18,
 speak(){
 console.log(\`我叫：\${this.name}，年龄：\${this.age}\`)
 }
}
interface 可以继承、合并-------------------------
interface PersonInterface {
 name: string // 姓名
 age: number // 年龄
}
interface PersonInterface {
 speak: () => void
}
interface StudentInterface extends PersonInterface {
 grade: string // 年级
}
const student: StudentInterface = {
 name: '李四',
 age: 18,
 grade: '⾼⼆',
 speak() {
 console.log(this.name,this.age,this.grade)
 }
}
type 的交叉类型----------------
// 使⽤ type 定义 Person 类型，并通过交叉类型实现属性的合并
type PersonType = {
 name: string; // 姓名
 age: number; // 年龄
} & {
 speak: () => void;
};
// 使⽤ type 定义 Student 类型，并通过交叉类型继承 PersonType
type StudentType = PersonType & {
 grade: string; // 年级
};
const student: StudentType = {
 name: '李四',
 age: 18,
 grade: '⾼⼆',
 speak() {
 console.log(this.name, this.age, this.grade);
 }
};
                
`
const codeBlock61 = `

                ⼀个类可以实现多个接⼝
                // FlyInterface 接⼝
interface FlyInterface {
 fly(): void;
}
// 定义 SwimInterface 接⼝
interface SwimInterface {
 swim(): void;
}
// Duck 类实现了 FlyInterface 和 SwimInterface 两个接⼝
class Duck implements FlyInterface, SwimInterface {
 fly(): void {
 console.log('鸭⼦可以⻜');
 }
 swim(): void {
 console.log('鸭⼦可以游泳');
 }
}
// 创建⼀个 Duck 实例
const duck = new Duck();
duck.fly(); // 输出: 鸭⼦可以⻜
duck.swim(); // 输出: 鸭⼦可以游泳
                
`
const codeBlock62 = `

    function logData< T>(data: T): T {
 console.log(data)
 return data
}
logData< number>(100)
logData< string>('hello')
                
`
const codeBlock63 = `

    function logData< T, U>(data1: T, data2: U): T | U {
 console.log(data1,data2)
 return Date.now() % 2 ? data1 : data2
}
logData< number, string>(100, 'hello')
logData< string, boolean>('ok', false)
                
`
const codeBlock64 = `

    interface PersonInterface< T> {
 name: string,
 age: number,
 extraInfo: T
}
let p1: PersonInterface< string>
let p2: PersonInterface< number>
p1 = { name: '张三', age: 18, extraInfo: '⼀个好⼈' }
p2 = { name: '李四', age: 18, extraInfo: 250 }
                
`
const codeBlock65 = `

    interface LengthInterface {
 length: number
}
// 约束规则是：传⼊的类型T必须具有 length 属性
function logPerson< T extends LengthInterface>(data: T): void {
 console.log(data.length)
}
logPerson< string>('hello')
// 报错：因为number不具备length属性
// logPerson< number>(100)
                
`
const codeBlock66 = `

    class Person< T> {
 constructor(
 public name: string,
 public age: number,
 public extraInfo: T
 ) { }
 speak() {
 console.log(\`我叫\${this.name}今年\${this.age}岁了\`)
 console.log(this.extraInfo)
 }
}
// 测试代码1
const p1 = new Person< number>("tom", 30, 250);
// 测试代码2
type JobInfo = {
 title: string;
 company: string;
}
const p2 = new Person< JobInfo>("tom", 30, { title: '研发总监', company: '发发发
科技公司' });
                
`
const codeBlock67 = `

    export function add(a, b) {
 return a + b;
}
export function mul(a, b) {
 return a * b;
}
d
                
`
const codeBlock68 = `

                    declare function add(a: number, b: number): number;
declare function mul(a: number, b: number): number;
export { add, mul };
                
`
const codeBlock69 = `

                    // example.ts
import { add, mul } from "./demo.js";
const x = add(2, 3); // x 类型为 number
const y = mul(4, 5); // y 类型为 number
console.log(x,y)
                
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