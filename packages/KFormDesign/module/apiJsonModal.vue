<template>
  <a-modal
    title="JSON数据"
    :footer="null"
    :visible="visible"
    @cancel="handleCancel"
    :destroyOnClose="true"
    wrapClassName="code-modal-9136076486841527"
    style="top: 20px"
    width="850px"
  >
    <div>
      <div class="json-box-9136076486841527">
        <codemirror
          style="height: 100%"
          ref="myEditor"
          v-model="editorJson"
          lineNumbers="false"
          mode="application/json"
        ></codemirror>
      </div>
      <div class="copy-btn-box-9136076486841527">
        <a-button
          @click="handleCopyJson"
          type="primary"
          class="copy-btn"
          data-clipboard-action="copy"
          :data-clipboard-text="editorJson"
        >
          复制数据
        </a-button>
        <a-button @click="handleSave" type="primary"> 保存 </a-button>
      </div>
    </div>
  </a-modal>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 * description 生成json Modal
 */
import Clipboard from "clipboard";
import { codemirror } from "vue-codemirror-lite";
export default {
  name: "apiJsonModal",
  // props: {
  //   value: {
  //     type: String,
  //     default: "",
  //   },
  // },
  data() {
    return {
      visible: false,
      editorJson: "{}"
      // jsonData: {},
    };
  },
  // watch: {
  //   value(newVal) {
  //     this.editorJson = newVal;
  //   },
  // },
  components: {
    codemirror
  },
  methods: {
    handleSave() {
      this.visible = false;
      console.log("handleSave", this.editorJson);
      this.$emit("saveJson", this.editorJson);
    },
    handleCancel() {
      this.visible = false;
    },
    handleCopyJson() {
      // 复制数据
      const clipboard = new Clipboard(".copy-btn");
      clipboard.on("success", () => {
        this.$message.success("复制成功");
      });
      clipboard.on("error", () => {
        this.$message.error("复制失败");
      });
      setTimeout(() => {
        // 销毁实例
        clipboard.destroy();
      }, 122);
    }
  }
};
</script>
