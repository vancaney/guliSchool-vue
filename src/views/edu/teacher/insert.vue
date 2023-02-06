<template>
  <div class="app-container">
    <el-form ref="form" :model="eduTeacher" label-width="120px">
      <el-form-item label="头像">
        <el-upload
          name="file"
          class="avatar-uploader"
          :action="BASE_API + '/eduoss/file'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="姓名" :label-width="formLabelWidth">
        <el-input v-model="eduTeacher.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="资历" :label-width="formLabelWidth">
        <el-input v-model="eduTeacher.career" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="头衔" :label-width="formLabelWidth">
        <el-select v-model="eduTeacher.level" placeholder="请选择讲师头衔">
          <el-option label="首席讲师" :value="1"></el-option>
          <el-option label="高级讲师" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="sort" :label-width="formLabelWidth">
        <el-input-number
          v-model="eduTeacher.sort"
          controls-position="right"
          :min="1"
          :max="10"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="简介" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          :rows="5"
          v-model="eduTeacher.intro"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addTeacher()">确认添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
.line {
  text-align: center;
}
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
import teacher from "@/api/edu/teacher/teacher";

export default {
  data() {
    return {
      eduTeacher: {
        name: "",
        intro: "",
        career: "",
        level: "",
        avatar: null,
        sort: 1,
      },
      formLabelWidth: "120px",
      imageUrl: null,
      BASE_API: process.env.BASE_API
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(res);
      this.imageUrl = URL.createObjectURL(file.raw);
      this.eduTeacher.avatar = res.data.imageUrl;
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
    addTeacher() {
      teacher
        .addeduTeacher(this.eduTeacher)
        .then((res) => {
          return this.$message({
            type: "success",
            message: "添加成功",
          });
        })
        .then((res) => {
          this.$router.push({ path: "/teacher/list" });
          console.log(res);
        })
        .catch((error) => {
          return this.$message({
            type: "error",
            message: "保存失败",
          });
        });
    },
  },
};
</script>



