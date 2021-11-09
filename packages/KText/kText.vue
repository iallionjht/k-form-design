/*
* 标签文字组件
*/ 

<template>
  <div>
    <a-text :style="{ width: record.options.width }"> asdfsadf </a-text>
  </div>
</template>
<script>
/*
 * author kcz
 * date 2019-12-31
 * description 上传图片组件
 */
export default {
  name: "kText",
  // eslint-disable-next-line vue/require-prop-types
  props: ["record", "value", "config", "parentDisabled", "formConfig"],
  data() {
    return {};
  },
  watch: {
    value: {},
  },
  computed: {},
  methods: {},
};
</script>
<style lang="less">
.upload-img-box-9136076486841527 {
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
}
</style>
