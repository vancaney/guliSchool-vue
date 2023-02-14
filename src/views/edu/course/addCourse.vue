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
        <el-input
          v-model="CourseInfo.title"
          placeholder="实例: 机器学习项目课: 从基础到搭建项目课程。专业名称注意大小写"
        ></el-input>
      </el-form-item>

      <el-form-item label="封面">
        <el-upload
          name="file"
          class="avatar-uploader"
          :action="BASE_API + '/eduoss/file'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="CourseInfo.cover" :src="CourseInfo.cover" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程分类">
        <el-cascader
          :options="data"
          @change="handleChange"
          :props="defaultProps"
          v-model="value"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="课程讲师">
        <el-select
          v-model="CourseInfo.teacherId"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="eduTeacher in eduTeacherList"
            :key="eduTeacher.name"
            :label="eduTeacher.name"
            :value="eduTeacher.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          v-model="CourseInfo.lessonNum"
          :min="1"
          :max="100"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="课程简介">
        <el-input v-model="CourseInfo.description"></el-input>
      </el-form-item>

      <el-form-item label="课时价格">
        <el-input-number v-model="CourseInfo.price" :min="1"></el-input-number>
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

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<script>
import course from "@/api/edu/course/course";
import teacher from "@/api/edu/teacher/teacher";
import subject from "@/api/edu/subject/subject";

export default {
  data() {
    return {
      CourseInfo: {
        id: "",
        title: "",
        teacherId: "",
        subjectId: "",
        subjectParentId: "",
        lessonNum: 1,
        description: "",
        price: 1,
        cover: "/static/01.jpg",
      },
      //如果需要改变data的key，需要加props属性。在props属性中改变data中的默认值
      data: [
        {
          id: "",
          title: "",
          children: [{}],
        },
      ],
      defaultProps: {
        children: "children",
        label: "title",
        value: "id",
      },
      //接受所有讲师
      eduTeacherList: [],
      name: "",
      saveBtnDisabled: false,
      BASE_API: process.env.BASE_API,
      isInsert: true,
      value: [],
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      //this.CourseInfo.cover = URL.createObjectURL(file.raw);
      this.CourseInfo.cover = res.data.imageUrl;
      //console.log(this.CourseInfo)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //联级选择器选择好数据后。对数据进行封装
    handleChange(value) {
      this.CourseInfo.subjectId = value[1];
      this.CourseInfo.subjectParentId = value[0];
      //console.log(this.CourseInfo.subjectId);
    },
    //课程分类。实现联级效果
    getSubjectList() {
      subject
        .getAllSubject()
        .then((res) => {
          this.data = res.data.data;
          //console.log(this.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //查询所有讲师姓名
    allEduTeacherList() {
      teacher
        .getEduteacherList()
        .then((res) => {
          this.eduTeacherList = res.data.eduTeacherList;
          //console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //添加课程信息
    addCourseInfo(CourseInfo) {
      course
        .addCourseInfo(CourseInfo)
        .then((res) => {
          this.$message({
            type: "success",
            message: "添加课程信息成功",
          });
          this.$router.push({ path: "/course/chapter/" + res.data.id });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //下一步按钮
    next() {
      if(this.isInsert)
        this.addCourseInfo(this.CourseInfo);
      else
        this.updateCourseInfo(this.CourseInfo);
    },
    //查询课程信息
    getCourseInfoByCourseId() {
      course
        .getCourseInfoById(this.CourseInfo.id)
        .then((res) => {
          this.CourseInfo = res.data.CourseInfo;
          this.value[1] = this.CourseInfo.subjectId;
          this.value[0] = this.CourseInfo.subjectParentId;
          //console.log(this.CourseInfo);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //更新courseInfo
    updateCourseInfo(CourseInfo){
      course.updateCourseInfo(CourseInfo)
      .then(res => {
        this.$message({
            type: "success",
            message: "添加课程信息成功",
          });
      })
    }
  },
  mounted: function () {
    if (this.$route.params && this.$route.params.id) {
      this.CourseInfo.id = this.$route.params.id;
      this.getCourseInfoByCourseId();
      this.isInsert = false;
    }
    this.allEduTeacherList();
    this.getSubjectList();
  },
};
</script>