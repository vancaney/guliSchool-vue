<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="courseQuery" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="courseQuery.status" placeholder="课程状态">
          <el-option label="已发布" :value="'Normal'"></el-option>
          <el-option label="未发布" :value="'Draft'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="eduCourseList((conditional = true))"
          >查询</el-button
        >
        <el-button type="default" @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>

    <!--讲师列表-->

    <el-button @click="deleteSelected()">批量删除</el-button>

    <el-table
      ref="multipleTable"
      :data="eduCourses"
      border
      style="width: 100%"
      @selection-change="handleSelectionChangeDepartment"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column fixed prop="id" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="title" label="课程名称" width="100">
      </el-table-column>
      <el-table-column prop="status" label="课程状态" width="600">
        <template slot-scope="scope">
          {{ scope.row.status === "Normal" ? "已发布" : "未发布" }}
        </template>
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数" width="120">
      </el-table-column>
      <el-table-column prop="viewCount" label="浏览量" width="180">
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" width="180">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="selectTeacher(scope.row)"
            >编辑课程基本信息</el-button
          >
          <el-button
            @click="deleteTeacher(scope.row)"
            type="danger"
            size="small"
            >编辑课程大纲信息</el-button
          >
          <el-button @click="deleteCourse(scope.row)" type="danger" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      align="center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[1, 30, 50, 100]"
      :page-size="pageInfo.pageSize"
      :current-page.sync="pageInfo.currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import course from "@/api/edu/course/course";

export default {
  data() {
    return {
      eduCourses: [],
      pageInfo: {
        pageSize: 1,
        currentPage: 1,
      },
      courseQuery: {
        title: "",
        status: "",
      },
      courseQueryResult: [],
      conditional: false,
      total: 0,
    };
  },
  methods: {
    //每页显示多少条
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.eduCourseList();
    },
    //上一页/下一页
    handleCurrentChange(currentPage) {
      this.pageInfo.currentPage = currentPage;
      this.eduCourseList();
    },
    eduCourseList() {
      if (this.conditional) {
        this.pageInfo.currentPage = 1;
        this.eduCourseListResult();
        this.conditional = false;
      } else {
        this.eduCourseListResult();
      }
    },
    eduCourseListResult() {
      this.courseQueryResult.push(this.courseQuery);
      this.courseQueryResult.push(this.pageInfo);
      course
        .coutseListByPage(this.courseQueryResult)
        .then((res) => {
          this.eduCourses = res.data.rows;
          this.total = res.data.total;
          //console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteCourse(data) {
      course
        .deleteCourseById(data.id)
        .then((res) => {
          let deleteAfterPage = Math.ceil(
            (this.total - 1) / this.pageInfo.pageSize
          );
          let current =
            this.pageInfo.currentPage > deleteAfterPage
              ? deleteAfterPage
              : this.pageInfo.currentPage;
          this.pageInfo.currentPage = current < 1 ? 1 : current;
          this.eduCourseList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    reset() {
      this.pageInfo = {
        pageSize: 10,
        currentPage: 1,
      };
      this.courseQuery = {
        title: "",
        status: "",
      };
      this.conditional = false;
      this.courseQueryResult = [];
      this.eduCourseList();
    },
  },
  mounted: function () {
    this.eduCourseList();
  },
};
</script>