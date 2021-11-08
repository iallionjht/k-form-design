/**
 * 解析多级 JSON 为一级 JSON
 *
 * @param  {Object} data JSON 数据
 *
 * @return {Object}
 */
const parse = data => {
  const uid = `uid_${Date.now()}`;
  const process = (input, prefix = "", json = {}) => {
    Object.keys(input).forEach(key => {
      const val = input[key];
      // eslint-disable-next-line no-prototype-builtins
      if (!json.hasOwnProperty(`${prefix}${key}.`)) {
        json[`${prefix}${key}.`] = uid;
      }

      if ("object" === typeof val && !Array.isArray(val) && !!val) {
        process(val, `${prefix}${key}.`, json);
      } else {
        json[`${prefix}${key}.`] = val;
      }
    });

    return json;
  };

  const json = process(data);
  const result = {};
  Object.keys(json).forEach(key => {
    if (json[key] !== uid) {
      result[key.slice(0, -1)] = json[key];
    }
  });
  return result;
};
export default {
  parse
};
