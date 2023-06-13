/* 新建一个 cos.js，导出 cos 实例 */
import COS from 'cos-js-sdk-v5' // 通过 npm 安装的 SDK
const cos = new COS({
  SecretId: 'AKIDXHp7CJON8sMcdQrHZcQ6bsvviIdiW2Hz',
  SecretKey: 'XmmjgSxMbfdQ1CAtNgkkY8YxBAtQhkY7'
})
export default cos
