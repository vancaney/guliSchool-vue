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

    <!-- 章节弹出层 添加和编辑共用 :show-close="false" :close-on-click-modal="false" -->
    <el-dialog
      title="章节信息"
      :visible.sync="dialogFormVisible"
      @close="cancle((dialogFormVisible = false))"
    >
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
        <el-button @click="cancle((dialogFormVisible = false))"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="saveChapter((dialogFormVisible = false))"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 课时弹出层 -->
    <el-dialog
      title="课时信息"
      :visible.sync="dialogForVideo"
      @close="videoCancle((dialogForVideo = false))"
    >
      <el-form :model="video">
        <el-form-item label="课时名称" :label-width="formLabelWidth">
          <el-input v-model="video.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否免费" :label-width="formLabelWidth">
          <el-radio v-model="video.isFree" label="1">免费</el-radio>
          <el-radio v-model="video.isFree" label="2">收费</el-radio>
        </el-form-item>
        <el-form-item label="课时排序" :label-width="formLabelWidth">
          <el-input-number
            v-model="video.sort"
            :min="1"
            :max="10"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="videoCancle((dialogForVideo = false))"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="saveVideoResult((dialogForVideo = false))"
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
      v-show="display"
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
          <el-button
            v-if="data.children"
            type="text"
            size="mini"
            @click="() => saveVideo(data)"
          >
            添加课时
          </el-button>
          <!-- , (dialogForVideo = true) -->
          <el-button type="text" size="mini" @click="() => edit(data)">
            <!-- , (dialogFormVisible = true) -->
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
import video from "@/api/edu/video/video";
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
        id: "",
        title: "",
        courseId: "",
        sort: 1,
      },
      video: {
        id: "",
        title: "",
        isFree: "1",
        sort: 1,
      },
      courseId: "",
      VideoId: "",
      saveBtnDisabled: false,
      dialogFormVisible: false,
      dialogForVideo: false,
      display: false,
      isSave: true,
      formLabelWidth: "120px",
    };
  },
  methods: {
    //添加章节信息
    saveChapter() {
      if (this.chapter.id == "") {
        this.chapter.courseId = this.courseId;
        chapter
          .addChapter(this.chapter)
          .then((res) => {
            this.$message({
              type: "success",
              message: "添加章节信息成功",
            });
            this.eduChapterList();
            this.chapter.title = "";
            this.chapter.id = "";
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.updateEduChapter();
      }
    },
    //课程dailog取消按钮
    cancle() {
      this.chapter = {
        id: '',
        title: '',
        sort: 1,
      };
    },
    //根据课程id获取章节列表
    eduChapterList() {
      chapter
        .getEduChapterList(this.courseId)
        .then((res) => {
          this.allChapterVideo = res.data.allChapterVideo;
          if (this.allChapterVideo.length != 0) this.display = true;
          else this.display = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //编辑按钮
    edit(data) {
      if (!data.children) {
        this.dialogForVideo = true;
        video
          .selectVideoById(data.id)
          .then((res) => {
            this.video = res.data.video;
            this.video.isFree = res.data.video.isFree + "";
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.dialogFormVisible = true;
        chapter.selectChapterById(data.id).then((res) => {
          this.chapter = res.data.eduChapter;
          //console.log(chapter);
        });
      }
      //console.log(data);
    },
    updateEduChapter() {
      chapter.updateChapterById(this.chapter).then((res) => {
        this.$message({
          type: "success",
          message: "修改课程信息成功",
        });
        this.eduChapterList();
        // this.chapter.title = "";
        // this.chapter.id = "";
      });
    },
    //删除按钮（删除章节和删除课时共用，需要判断是删除课时还是删除章节）
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      console.log(data);
      if (data.children) {
        chapter
          .deleteChapterById(data.id)
          .then((res) => {
            this.$message({
              type: "success",
              message: "删除章节成功",
            });
            this.eduChapterList();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        video
          .deleteVideoById(data.id)
          .then((res) => {
            this.$message({
              type: "success",
              message: "删除课时成功",
            });
            this.eduChapterList();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    //添加课时按钮
    saveVideo(data) {
      this.video.chapterId = data.id;
      this.video.courseId = this.courseId;
      this.dialogForVideo = true;
      //console.log(data);
    },
    //课时dailog的确定按钮（新增和编辑在共用一个表单，所以需要判断是编辑还是新增操作）
    saveVideoResult() {
      //新增
      if (!this.video.id) {
        video
          .addEduVideo(this.video)
          .then((res) => {
            this.$message({
              type: "success",
              message: "添加课时成功",
            });
            this.eduChapterList();
            this.video.id = "";
          })
          .catch((error) => {
            console.log(error);
          });
        //编辑
      } else {
        video
          .updateEduVideo(this.video)
          .then((res) => {
            this.$message({
              type: "success",
              message: "修改课时成功",
            });
            this.eduChapterList();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    //课时dailog取消按钮
    videoCancle() {
      this.video = {
        isFree: '1',
        sort: 1,
      };
    },
    previous() {
      this.$router.push({ path: "/course/addCourse/" + this.courseId });
    },
    next() {
      this.$router.push({ path: "/course/publish/" + this.courseId });
    }
  },
  mounted: function () {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.eduChapterList();
    }
  },
};
</script>