<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="3"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="提交审核"></el-step>
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublishVo.cover" />
      <div class="main">
        <h2>{{ coursePublishVo.title }}</h2>
        <p class="gray">
          <span>共{{ coursePublishVo.lessonNum }}课时</span>
        </p>
        <p>
          <span
            >所属分类:{{ coursePublishVo.subjectLevelOne }} -
            {{ coursePublishVo.subjectLevelTwo }}</span
          >
        </p>
        <p>课程讲师:{{ coursePublishVo.teacherName }}</p>
        <h3 class="red">¥{{ coursePublishVo.price }}</h3>
      </div>
    </div>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">返回修改</el-button>
        <el-button :disabled="saveBtnDisable" type="primary" @click="publish"
          >发布课程</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.ccInfo {
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #ddd;
  margin-bottom: 40px;
  position: relative;
}

.ccInfo img {
  background: #d6d6d6;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}

.ccInfo main {
  margin-left: 520px;
}
.ccInfo .main h2 {
  font-size: 20px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main h3 {
  left: 540px;
  bottom: 20px;
  line-height: 1;
  font-size: 28px;
  color: #d32f24;
  font-weight: normal;
  position: absolute;
}
</style>

<script>
import course from "@/api/edu/course/course";
export default {
  data() {
    return {
      coursePublishVo: {},
      saveBtnDisabled: false,
      courseId: "",
      src: "",
    };
  },
  created() {
    console.log("publish created");
  },
  methods: {
    courseInfoList() {
      course
        .selectCourseInfoVoByCourseId(this.courseId)
        .then((res) => {
          this.coursePublishVo = res.data.coursePublishVo;
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    previous() {
      console.log("previous");
      this.$router.push({ path: "/course/chapter/" + this.courseId });
    },
    publish() {
      console.log("publish");
      course.updateCourseStatus(this.courseId).then((res) => {
        this.$message({
          type: "success",
          message: "发布课程成功",
        });
        this.$router.push({ path: "/course/list" });
      }).catch(error => {
        console.log(error);
      })
    },
  },
  mounted: function () {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
    }
    this.courseInfoList();
  },
};
</script>