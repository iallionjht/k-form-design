import jsonutil from "./jsonutil";
const parseResponse = response => {
  console.log("parseResponse", response);
  let res = response.replace(/\r/g, "");
  res = res.replace(/\n/g, "");
  res = res.replace(/\t/g, "");
  res = JSON.parse(res);
  console.log(res.success);
  if (res.success) {
    console.log("enter")
    if (res.result != null) {
      console.log("result ok")
      if (res.result instanceof Array) {
        console.log("result array")
        const retList = [];
        res.result.forEach(element => {
          const out = jsonutil.parse(element);
          retList.push(out);
        });
        return retList;
      } else {
        return jsonutil.parse(res.result);
      }
    }
  }
};
export {
  parseResponse
};