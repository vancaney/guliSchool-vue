<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="TeacherQuery" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="TeacherQuery.name" placeholder="讲师名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="TeacherQuery.level" placeholder="讲师头衔">
          <el-option label="首席讲师" :value="1"></el-option>
          <el-option label="高级讲师" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <span class="demonstration">添加时间</span>
      <el-date-picker
        value-format="yyyy-MM-dd HH:mm:ss"
        v-model="TeacherQuery.time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <el-form-item>
        <el-button
          type="primary"
          @click="teacherListByPage((conditional = true))"
          >查询</el-button
        >
        <el-button type="default" @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>

    <!--讲师列表-->

    <el-button @click="deleteSelected()">批量删除</el-button>

    <el-table
      ref="multipleTable"
      :data="eduTeachers"
      border
      style="width: 100%"
      @selection-change="handleSelectionChangeDepartment"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column fixed prop="id" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100"> </el-table-column>
      <el-table-column prop="intro" label="简介" width="600"> </el-table-column>
      <el-table-column prop="career" label="资历" width="120">
      </el-table-column>
      <el-table-column prop="level" label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? "首席讲师" : "高级讲师" }}
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" width="180">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="selectTeacher(scope.row)"
            >编辑</el-button
          >
          <el-button
            @click="deleteTeacher(scope.row)"
            type="danger"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--表单弹框-->
    <el-dialog title="讲师信息" :visible.sync="dialogFormVisible">
      <el-form :model="eduTeacher">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input
            v-model="eduTeacher.id"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="eduTeacher.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="头像" :label-width="formLabelWidth">
          <el-upload
          class="avatar-uploader"
          :action="BASE_API + '/eduoss/file'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="eduTeacher.avatar" :src="eduTeacher.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        </el-form-item>
        

        <el-form-item label="头衔" :label-width="formLabelWidth">
          <el-select v-model="eduTeacher.level" placeholder="请选择讲师头衔">
            <el-option label="首席讲师" :value="1"></el-option>
            <el-option label="高级讲师" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <!-- elementUI el-input 输入框 设置高度和宽度 :rows="10"，是关键，但是仅使用这个还不行，最起码要配合 type="textarea" 才能实现 -->
          <el-input
            type="textarea"
            :rows="5"
            v-model="eduTeacher.intro"
            autocomplete="off"
          ></el-input> </el-form-item
        ><el-form-item label="资历" :label-width="formLabelWidth">
          <el-input
            v-model="eduTeacher.career"
            autocomplete="off"
          ></el-input> </el-form-item
        ><el-form-item label="创建时间" :label-width="formLabelWidth">
          <el-input
            v-model="eduTeacher.gmtCreate"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="eidtTeacher((dialogFormVisible = false))"
          >确认修改</el-button
        >
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      align="center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="pageInfo.pageSize"
      :current-page.sync="pageInfo.currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
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
    border-color: #409EFF;
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
      eduTeachers: [],
      //讲师对象，在编辑表单中。
      eduTeacher: {},
      // eduTeacher: {
      //   id: "",
      //   name: "",
      //   intro: "",
      //   career: "",
      //   level: '',
      //   gmtCreate: "",
      // },
      TeacherQuery: {
        name: "",
        level: null,
        time: [],
      },
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        pageString: null,
      },
      //用于封装TeacherQuery，pageInfo传到后端。前端带条件分页查询和查询所有的分页共用一个table组件。
      teacherQueryResult: [],
      deletePage: 0,
      conditional: false,
      total: 100,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      //批量删除时，用于封装id。
      eduTeacherIds: [],
      //eduTeacherIdList: [],
      BASE_API: process.env.BASE_API


    };
  },
  created() {},
  methods: {
    handleAvatarSuccess(res, file) {
        this.eduTeacher.avatar = res.data.imageUrl;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

    //每页显示多少条
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.teacherListByPage();
    },
    //上一页/下一页
    handleCurrentChange(currentPage) {
      this.pageInfo.currentPage = currentPage;
      this.teacherListByPage();
    },
    //分页查询(带条件和不带条件)
    queryPageBase() {
      this.teacherQueryResult.push(this.TeacherQuery);
      this.teacherQueryResult.push(this.pageInfo);
      teacher
        .getTeacherListByPage(this.teacherQueryResult)
        .then((res) => {
          this.eduTeachers = res.data.rows;
          this.total = res.data.total;
          //console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    teacherListByPage(conditional) {
      // this.teacherQueryResult.push(this.TeacherQuery);
      // this.teacherQueryResult.push(this.pageInfo);
      if (!conditional) {
        this.queryPageBase();
        // teacher
        //   .getTeacherListByPage(this.teacherQueryResult)
        //   .then((res) => {
        //     this.eduTeachers = res.data.rows;
        //     this.total = res.data.total;
        //     console.log(res.data);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
      } else {
        this.pageInfo.currentPage = 1;
        this.queryPageBase();
        // teacher
        //   .getTeacherListByPage(this.teacherQueryResult)
        //   .then((res) => {
        //     this.eduTeachers = res.data.rows;
        //     this.total = res.data.total;
        //     console.log(res.data);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
      }
    },
    //根据ID查询
    selectTeacher(data) {
      this.dialogFormVisible = true;
      teacher
        .selectTeacherById(data.id)
        .then((res) => {
          this.eduTeacher = res.data.eduTeacher;
          //console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //编辑讲师
    eidtTeacher() {
      teacher
        .editeduTeacher(this.eduTeacher)
        .then((res) => {
          if (res.code == 20000) {
            this.$message.success(res.message);
            this.teacherListByPage();
            //console.log(res);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //删除讲师
    // deleteTeacher(data) {
    //   teacher
    //     .deleteById(data.id)
    //     .then((res) => {
    //       let deleteAfterPage = Math.ceil(
    //         (this.total - 1) / this.pageInfo.pageSize
    //       );
    //       let current =
    //         this.pageInfo.currentPage > deleteAfterPage
    //           ? deleteAfterPage
    //           : this.pageInfo.currentPage;
    //       this.pageInfo.currentPage = current < 1 ? 1 : current;
    //       this.teacherListByPage();
    //       console.log(res);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    deleteTeacher(data) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          teacher.deleteById(data.id).then((res) => {
            let deleteAfterPage = Math.ceil(
              (this.total - 1) / this.pageInfo.pageSize
            );
            let current =
              this.pageInfo.currentPage > deleteAfterPage
                ? deleteAfterPage
                : this.pageInfo.currentPage;
            this.pageInfo.currentPage = current < 1 ? 1 : current;
            this.teacherListByPage();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //console.log(res);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //重置按钮
    reset() {
      this.TeacherQuery = {
        name: "",
        level: null,
        time: [],
      };
      this.pageInfo = {
        currentPage: 1,
        pageSize: 10,
        pageString: null,
      };
      this.teacherQueryResult = [];
      this.teacherListByPage();
    },
    handleSelectionChangeDepartment(val) {
      this.eduTeacherIds = val;
    },
    deleteSelected() {
      this.$confirm("此操作将批量删除讲师信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let val = this.eduTeacherIds; //选中的值
        let eduTeacherIdList = [];
        //console.log(val);
        if (val) {
          for (let i = 0; i < val.length; i++) {
            //console.log(val[i].id);
            eduTeacherIdList[i] = val[i].id;
          }
        }
        //console.log(this.eduTeacherIdList);
        teacher.deleteMuch(eduTeacherIdList).then((res) => {
          //this.deletePage = res.data.deletePage;
          this.teacherListByPage();
          this.$message.success("删除成功");
        });
      });
    },
  },
  mounted: function () {
    this.teacherListByPage();
  },
};
</script>