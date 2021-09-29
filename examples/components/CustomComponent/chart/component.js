import MyChartVue from "./index.vue";

export const MyChart1 = {
    type: "demo", // 表单类型
    label: "自定义组件ff", // 标题文字
    icon: "icon-gallery",
    component: MyChartVue,
    options: {
        defaultValue: undefined,
        multiple: false,
        disabled: false,
        width: "100%",
        clearable: true,
        placeholder: "请选择",
        showSearch: false
    },
    model: "",
    key: "",
    rules: [{
        required: false,
        message: "必填项"
    }]
}