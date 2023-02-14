<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>

    <el-button @click="dialogFormVisible = true" type="primary"
      >添加章节</el-button
    >
    <el-dialog title="章节信息" :visible.sync="dialogFormVisible">
      <el-form :model="chapter">
        <el-form-item label="章节名称" :label-width="formLabelWidth">
          <el-input v-model="chapter.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="章节排序" :label-width="formLabelWidth">
          <el-input-number
            v-model="chapter.sort"
            :min="1"
            :max="10"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveChapter((dialogFormVisible = false))"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- <ul>
      <li v-for="chapterVideo in allChapterVideo" :key="chapterVideo.id">
        {{ chapterVideo.title }}
        <ul>
          <li v-for="video in chapterVideo.children" :key="video.id">
            {{ video.title }}
          </li>
        </ul>
      </li>
    </ul> -->

    <el-tree
      :props="defaultProps"
      :data="allChapterVideo"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="text" size="mini" @click="() => edit(data , dialogFormVisible = true)">
            编辑
          </el-button>
          <el-button type="text" size="mini" @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisable" type="primary" @click="next"
          >下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

<script>
import chapter from "@/api/edu/chapter/chapter";
export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "title",
        value: "id",
      },
      allChapterVideo: [],
      chapter: {
        id: '',
        title: "",
        courseId: "",
        sort: 1,
      },
      courseId: "",
      saveBtnDisabled: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
    };
  },
  methods: {
    //添加章节信息
    saveChapter() {
      this.chapter.courseId = this.courseId;
      chapter
        .addChapter(this.chapter)
        .then((res) => {
          this.$message({
            type: "success",
            message: "添加章节信息成功",
          });
          this.chapter.sort++;
          this.eduChapterList();
          this.chapter.title = '';
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //根据课程id获取章节列表
    eduChapterList() {
      chapter
        .getEduChapterList(this.courseId)
        .then((res) => {
          this.allChapterVideo = res.data.allChapterVideo;
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //编辑按钮
    edit(data) {
      chapter.selectChapterById(data.id)
      .then(res =>{
        this.chapter = res.data.eduChapter;
        console.log(chapter)
      })
      //console.log(data);
    },
    //根据id删除章节
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      chapter.deleteChapterById(data.id)
      .then(res => {
        this.$message({
          type: 'success',
          message: '删除章节成功'
        })
        this.eduChapterList();
      })
      .catch(error => {
        console.log(error);
      })
    },
    previous() {
      this.$router.push({ path: "/course/addCourse/" + this.courseId });
    },
    next() {
      this.$router.push({ path: "/course/publish/1" });
    },
  },
  mounted: function () {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.eduChapterList();
    }
  },
};
</script>