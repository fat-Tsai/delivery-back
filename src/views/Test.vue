<template>
    <div class="addBrand-container" id="food-add-app">
    <div class="container">
        <el-upload class="avatar-uploader"
                action="/api/common/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeUpload"
                ref="upload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Test',
  data () {
    return {
      imageUrl: ''
    }
  },
  methods: {
    handleAvatarSuccess (response, file, fileList) {
      this.imageUrl = `/api/common/download?name=${response.data}`
      console.log(this.imageUrl)
    },
    beforeUpload (file) {
      if (file) {
        const suffix = file.name.split('.')[1]
        const size = file.size / 1024 / 1024 < 2
        if (['png', 'jpeg', 'jpg'].indexOf(suffix) < 0) {
          this.$message.error('上传图片只支持 png、jpeg、jpg 格式！')
          this.$refs.upload.clearFiles()
          return false
        }
        if (!size) {
          this.$message.error('上传文件大小不能超过 2MB!')
          return false
        }
        return file
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
