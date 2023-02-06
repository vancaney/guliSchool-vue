<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="提交审核"></el-step>
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="CourseInfo.title" placeholder="实例: 机器学习项目课: 从基础到搭建项目课程。专业名称注意大小写"></el-input>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          v-model="CourseInfo.lessonNum"
          :min="1"
          :max="100"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="课程简介">
        <el-input v-model="CourseInfo.description" type="extratext"></el-input>
      </el-form-item>

      <el-form-item label="课时价格">
        <el-input-number
          v-model="CourseInfo.price"
          :min="1"
        ></el-input-number>
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          style="margin-top: 12px"
          @click="next"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CourseInfo: {
        title: '',
        lessonNum: 1,
        description: '',
        price: 1
      },
      saveBtnDisabled: false,
    };
  },
  methods: {
    next() {
      this.$router.push({ path: "/course/chapter/1" });
    },
  },
  mounted: function () {},
};
</script>