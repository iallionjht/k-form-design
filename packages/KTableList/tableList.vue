<!--
 * @Description: 动态表格列表 用于批量填入数据
 * @Author: kcz
 * @Date: 2020-03-27 18:36:56
 * @LastEditors: kcz
 * @LastEditTime: 2021-05-14 14:04:14
 -->
<template>
  <a-form-model
    ref="dynamicValidateForm"
    layout="inline"
    :model="dynamicValidateForm"
  >
    <a-table
      height="100px"
      class="batch-table"
      :pagination="true"
      :rowKey="(record) => record.key"
      :columns="columns"
      :dataSource="dynamicValidateForm.domains"
      bordered
      :scroll="{
        x: listLength * 190 + 80 + (!record.options.hideSequence ? 60 : 0),
        y: record.options.scrollY,
      }"
    >
      <template
        v-for="item in record.list"
        :slot="item.key"
        slot-scope="text, record, index"
        style="height: 200px"
      >
        <KTableListModelItem
          :key="item.key + '1'"
          :record="item"
          :config="config"
          :parentDisabled="disabled"
          :index="index"
          :domains="dynamicValidateForm.domains"
          :dynamicData="dynamicData"
          v-model="record[item.model]"
          :textVal="record[item.model]"
          @input="handleInput"
        />
      </template>
      <!-- <template slot="dynamic-opr-button" slot-scope="text, record">
        <a-icon
          title="删除改行"
          v-if="!disabled"
          class="dynamic-opr-button"
          type="minus-circle-o"
          @click="removeDomain(record)"
        />
        <a-icon
          title="复制添加"
          v-if="!disabled"
          type="copy-o"
          class="dynamic-opr-button"
          @click="copyDomain(record)"
        />
      </template> -->
    </a-table>
    <!-- <a-button type="dashed" :disabled="disabled" @click="addDomain">
      <a-icon type="plus" />增加
    </a-button> -->
  </a-form-model>
</template>

<script>
// import { axios } from "../util/request";
import KTableListModelItem from "./module/KTableLIstModelItem";
import { parseResponse } from "../util/controlData";
export default {
  name: "KTableList",
  props: ["record", "value", "dynamicData", "config", "parentDisabled"],

  components: {
    KTableListModelItem,
  },
  watch: {
    value: {
      // value 需要深度监听及默认先执行handler函数
      handler(val) {
        this.dynamicValidateForm.domains = val || [];
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.initData();
  },
  created() {
    console.log("table list create");
  },
  data() {
    return {
      dynamicValidateForm: {
        domains: [],
      },
    };
  },
  computed: {
    listLength() {
      return this.record.list.filter((item) => !item.options.hidden).length;
    },
    columns() {
      const columns = [];
      if (!this.record.options.hideSequence) {
        columns.push({
          title: "序号",
          dataIndex: "sequence_index_number",
          width: "60px",
          align: "center",
          customRender: (text, record, index) => {
            return index + 1;
          },
        });
      }
      // 不能固定宽度，要使用自定义,每个控件应该有标签宽度这个属性
      columns.push(
        ...this.record.list
          .filter((item) => !item.options.hidden)
          .map((item, index) => {
            return {
              title: item.label,
              dataIndex: item.key,
              width:
                index === this.record.list.length - 1
                  ? ""
                  : item.labelWidth + "px",
              scopedSlots: { customRender: item.key },
            };
          })
      );

      // columns.push({
      //   title: "操作",
      //   dataIndex: "dynamic-opr-button",
      //   fixed: "right",
      //   width: "80px",
      //   align: "center",
      //   scopedSlots: { customRender: "dynamic-opr-button" },
      // });

      return columns;
    },
    disabled() {
      return this.record.options.disabled || this.parentDisabled;
    },
  },
  methods: {
    constructListData(res) {
      if (res != null) {
        const list = res;
        // this.record.list.forEach((item) => {
        //   data[item.model] = item.options.defaultValue;
        // });

        let now = Date.now();
        list.forEach((item) => {
          const data = {};
          this.record.list.forEach((recordItem) => {
            // console.log("item = ", item);
            // console.log("recordItem = ", recordItem);
            data[recordItem.model] = item[recordItem.model];
          });
          // console.log("now = ", now, data);
          this.dynamicValidateForm.domains.push({
            ...data,
            key: now,
          });
          now++;
        });
      }
    },
    initData() {
      //获取静态或动态数据进行数据初始化
      if (!this.record.options.dataSourceDynamic) {
        const listData = parseResponse(this.record.options.staticReqData);
        this.constructListData(listData);
      } else {
        console.log("get data from server");
        // this.record.options.dynamicReqData
        // axios.get("/test1").then((res) => {
        //   }
        // });
      }
    },
    validationSubform() {
      let verification;
      this.$refs.dynamicValidateForm.validate((valid) => {
        verification = valid;
      });
      return verification;
    },
    resetForm() {
      this.$refs.dynamicValidateForm.resetFields();
    },
    removeDomain(item) {
      const index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    copyDomain(record) {
      const data = {};
      this.record.list.forEach((item) => {
        data[item.model] = record[item.model];
      });
      this.dynamicValidateForm.domains.push({
        ...data,
        key: Date.now(),
      });
      this.handleInput();
    },
    addDomain() {
      const data = {};
      this.record.list.forEach((item) => {
        data[item.model] = item.options.defaultValue;
      });

      this.dynamicValidateForm.domains.push({
        ...data,
        key: Date.now(),
      });
      this.handleInput();
    },
    handleInput() {
      this.$emit("change", this.dynamicValidateForm.domains);
    },
  },
};
</script>
<style scoped>
.dynamic-opr-button:last {
  margin-left: 0px;
}
.dynamic-opr-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 16px;
  color: #999;
  transition: all 0.3s;
  margin-left: 6px;
}
.dynamic-opr-button:hover {
  color: #e89;
}
.dynamic-opr-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
