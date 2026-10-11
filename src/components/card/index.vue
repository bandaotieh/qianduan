<template>
    <el-card :class="showAll ? 'card_all' : 'card'">
        <template #header>
            <div class="card-header">
                <span>{{ title }}</span>
            </div>
        </template>
       <slot  name="default" >
      
       </slot>
        <template #footer >
             <el-button v-show="!showAll" type="primary" @click="showAll = true" >显示更多</el-button>
             <el-button  v-show="showAll" type="primary" @click="showAll = false" >收回</el-button>

        </template>
    </el-card>
</template>
<script setup lang="ts">
import { ref } from 'vue';

 defineProps(['title'])
 const showAll = ref(false)

</script>
<style lang="css" scoped>
.card {
    width: 20vw;
    height: 15vw;
    margin-top: 1vh;

    margin-bottom: 2vh;
}
.card_all {
  position: absolute;
  left: 10%;
  top: 5%;
    width: 80%;
    height: 80vh;
}
/* ::v-deep .ep-card__body{
    overflow: hidden !important;
} */
</style>