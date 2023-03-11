<template>
  <div class="login-container">
    <br />
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="请选择时间">
        <el-date-picker
          v-model="day"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createsta">生成</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import staApi from "@/api/sta";

export default {
  data() {
    return {
      day: "",
    };
  },
  watch: {},
  methods: {
    createsta() {
      staApi
        .createDigital(this.day)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted: function () {},
};
</script>
