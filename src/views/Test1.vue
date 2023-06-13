<template>
    <div class="addBrand-container" id="food-add-app">
    <div class="container">
        <el-upload class="avatar-uploader"
                action="http://upload-z2.qiniup.com"
                :headers="headers"
                :data="upform"
                :show-file-list="false"
                :before-upload="beforeUpload"
                ref="upload"
                :on-remove="removeHandle"
                on-success="handleAvatarSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-progress type="circle" :percentage="75"></el-progress>
        <el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>
    </div>
  </div>
</template>

<script>
import { getUploadToken, up2QiNiu } from '@/api'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Test',
  data () {
    return {
      domin: 'http(s)://upload-z2.qiniup.com',
      serve: 'http://rkt7dnyi5.hn-bkt.clouddn.com/',
      headers: { 'Content-Type': 'multipart/form-data' },
      form: {
        token: ''
      },
      imageUrl: '',
      number: 75
    }
  },
  methods: {
    toQiniu () {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      up2QiNiu(this.domin, this.upform, config).then(res => {
        console.log(res)
      })
    },
    handleAvatarSuccess (response, file, fileList) {
      console.log(`response:${response}`)
      console.log(`file:${file}`)
      console.log(`fileList:${fileList}`)
    //   this.imageUrl = response.data
    //   console.log(this.imageUrl)
    },
    async beforeUpload (file) {
      if (file) {
        const fileName = file.name
        console.log('fileName', fileName)
        const suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
        const size = file.size / 1024 / 1024 < 2
        console.log(`suffix:${suffix}`)
        console.log(`size:${size}`)
        if (['png', 'jpeg', 'jpg'].indexOf(suffix) < 0) {
          this.$message.error('上传图片只支持 png、jpeg、jpg 格式！')
          this.$refs.upload.clearFiles()
          return false
        }
        if (!size) {
          this.$message.error('上传文件大小不能超过 2MB!')
          return false
        }
        // 获取token
        const { data: res } = await getUploadToken()
        // console.log('uploadToken:', res)
        this.form.token = res
        return file
      }
    },
    removeHandle (file, fileList) {
      console.log('删除了')
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #1a1717;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
