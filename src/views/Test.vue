<template>
    <div class="addBrand-container" id="food-add-app">
    <div class="container">
        <el-upload class="avatar-uploader"
                action="/api/common/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeUpload"
                ref="upload"
                :on-remove="removeHandle">
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
      this.imageUrl = response.data
      console.log(this.imageUrl)
    },
    beforeUpload (file) {
      console.log(`file:${file}`) // [object File] 如何把file读出来
      const data = JSON.stringify(file)
      console.log(data)
      console.log(file.location)
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
        console.log(`file文件应该是我们自己定义的${file}`)
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
