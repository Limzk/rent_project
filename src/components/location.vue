<template>
    <el-cascader
      class="cascader"
      size="mini"
      :options="options"
      v-model="selectedOptions"
      @change="addressChange">
    </el-cascader>
</template>

<script>
import { regionDataPlus,CodeToText } from 'element-china-area-data'
export default {
  name: 'location',
  data(){
    return {
      options: regionDataPlus,
      selectedOptions: []
    }
  },
  methods: {
      addressChange(arr) {
          console.log(CodeToText[arr[0]],CodeToText[arr[1]],CodeToText[arr[2]],);
      },
  }
};
</script>
<style scoped>
.cascader{
  float:right;
  margin: 10px 10px 0;
}
.cascader >>> .el-input{
  border-radius: 0!important;
}
</style>