<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模板说明</el-tag>
        <el-button size="medium" @click="downloadTemplate">模板下载</el-button>
      </el-form-item>

      <el-form-item label="上传文件">
        <el-upload
          class="upload-demo"
          ref="upload"
          :limit="1"
          :action="BASE_API + '/eduSubject/addSubject'"
          :on-success="FileUploadSuccess"
          :on-error="FileUploadError"
          name="file"
          :auto-upload="false"
          :disabled="importBtnDisabled"
          accept="application/vnd.ms-excel"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <el-button
            :loading="loading"
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>

    <!-- <div slot="tip" class="el-upload__tip">只能上excel传文件</div> -->
  </div>
</template>

<style>
</style>

<script>
export default {
  data() {
    return {
      BASE_API: process.env.BASE_API,
      loading: false,
      importBtnDisabled: false,
    };
  },
  methods: {
    submitUpload() {
      this.loading = true;
      this.importBtnDisabled = true;
      this.$refs.upload.submit();
    },
    FileUploadSuccess() {
      this.loading = false;
      this.$refs.upload.clearFiles(); //上传成功之后清除历史记录
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    FileUploadError() {
      this.loading = false;
      this.$refs.upload.clearFiles(); //上传成功之后清除历史记录
      this.$message({
        type: "error",
        message: "上传失败",
      });
    },
    // 点击模板按钮触发a下载文件
    downloadTemplate() {
      let a = document.createElement("a");
      a.href = "./static/subject_template.xls";
      a.download = "subject_template.xls";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
  },
};
</script>



