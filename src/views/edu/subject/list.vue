<template>
  <div class="app-container">
    <!-- <span>科目列表</span> -->
    <el-input v-model="filterText" placeholder="请输入科目名称"></el-input>
    <!-- @node-click="handleNodeClick" -->
    <el-tree
      ref="tree2"
      :filter-node-method="filterNode"
      :data="data"
      :props="defaultProps"
    ></el-tree>
  </div>
</template>

<script>
import subject from "@/api/edu/subject/subject";

export default {
  data() {
    return {
      data: [
        {
          id: "",
          title: "",
          children: [{}],
        },
      ],
      filterText: "",
      defaultProps: {
        children: "children",
        label: "title",
      },
      title: null,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
  },
  methods: {
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
    filterNode(value, data) {
      //console.log(value);
      //console.log(data);
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value) !== -1;
    },
    // handleNodeClick(data) {
    //     console.log(data);
    //   }
  },
  mounted: function () {
    this.getSubjectList();
  },
};
</script>
