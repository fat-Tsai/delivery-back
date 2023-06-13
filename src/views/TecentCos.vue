<template>
    <div>
        用来测试腾讯cos结合ElementUI的upload
        <!-- <el-upload
            action="#"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="fileList"
            :http-request="handleRequest"
            >
            <i class="el-icon-plus" />
        </el-upload> -->
        <!-- <el-upload class="avatar-uploader"
                action="https://delivery-1313364762.cos.ap-nanjing.myqcloud.com"
                :headers="headers"
                :data="upform"
                :show-file-list="false"
                :before-upload="beforeUpload"
                ref="upload"
                :on-remove="removeHandle"
                on-success="handleAvatarSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
        <el-upload
            :on-preview="preview"
            :on-remove="handleRemove"
            :on-change="changeFile"
            :before-upload="beforeUpload"
            :file-list="fileList"
            list-type="picture-card"
            action="#"
            :limit="1"
            :class="{ disabled: fileComputed }"
            :http-request="upload"
            >
            <i class="el-icon-plus" />
        </el-upload>
        <el-progress
            v-if="showPercent"
            style="width: 180px"
            :percentage="percent"
        />
        <el-dialog title="图片" :visible.sync="showDialog">
            <img :src="imgUrl" style="width: 100%" alt="" />
        </el-dialog>
    </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDXHp7CJON8sMcdQrHZcQ6bsvviIdiW2Hz',
  SecretKey: 'XmmjgSxMbfdQ1CAtNgkkY8YxBAtQhkY7'
})
export default {
  name: 'TecentCos',
  data () {
    return {
      // 默认浏览器已经存在的图片信息
    //   fileList: [
    //     { name: 'food.jpeg', url: '图片地址：页面默认图片' },
    //     { name: 'food2.jpeg', url: '图片地址：页面默认图片' }
    //   ],
      fileList: [],
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: null, // 确定上传图片的id
      showPercent: false, // 状态加载条
      percent: 0 // 进度条加载过程
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed () {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 预览图片时的回调
    preview (file) {
      this.imgUrl = file.url // 点击预览时，传递图片地址给弹出层
      this.showDialog = true
    },
    // 删除图片的回调
    handleRemove (file) {
      // file是点击删除的文件
      //   将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid)
    },
    // 修改文件时触发
    // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
    // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
    // [] => [...fileList] [] => fileList.map()
    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    /*
    文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    */
    changeFile (file, fileList) {
      this.fileList = fileList.map((item) => item)
    },
    // 上传之前检查
    beforeUpload (file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']

      /*  if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      } */
      if (!types.some((item) => item === file.type)) {
        // 此时说明上传的类型不是规定类型
        this.$message.warning('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // 停止上传
      }
      //  检查大小
      // 1mb 等于 1024KB 1KB=1024B
      // 限制大小为5mb
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 此时upload组件会为文件对象生成一个id属性

      this.currentFileUid = file.uid
      // 显示加载进度条
      this.showPercent = true
      return true
    },
    // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
    // 进行上传操作
    upload (params) {
      //   console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: 'delivery-1313364762', // 存储桶
            Region: 'ap-nanjing', // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            onProgress: (params) => {
              this.percent = params.percent * 100
            }
          },
          (err, data) => {
            // 这个回调需要使用箭头函数，因为currentFileUid在当前组件实例对象上，
            // 箭头函数没有this,会继承upload方法的this，它的this执行vue组件实例

            // data中有一个statusCode === 200 的时候说明上传成功
            if (!err && data.statusCode === 200) {
              //   此时说明文件上传成功  云服务器会返回一个地址，我们需要把该地址放到组件的img标签上
              //  此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
              // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
              // 需要知道当前上传成功的是哪一张图片
              this.fileList = this.fileList.map((item) => {
                // 去找谁的uid等于刚刚记录下来的id
                if (item.uid === this.currentFileUid) {
                  // Location为传回的地址，但是没有http字段
                  // 将成功的地址赋值给原来的url属性
                  console.log(data.Location)
                  return { url: 'https://' + data.Location, upload: true }

                  // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                  // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
                }
                return item
              })
              // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
              setTimeout(() => {
                this.showPercent = false // 隐藏进度条
                this.percent = 0 // 进度归0
              }, 1000)
            }
          }
        )
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
