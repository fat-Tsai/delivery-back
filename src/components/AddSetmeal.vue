<template>
    <div class="addBrand-container">
        <div class="container">
            <el-form ref="form" :model="form" label-width="180px">
                <el-form-item
                    label="套餐分类:"
                    prop="idType">
                    <el-select
                        v-model="form.idType"
                        placeholder="请选择套餐分类">
                        <el-option v-for="item in setmealList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="套餐名称" required>
                    <el-input v-model="form.name" placeholder="请填写套餐名称"></el-input>
                </el-form-item>
                <el-form-item label="套餐价格" required>
                    <el-input v-model="form.price" placeholder="请设置套餐价格"></el-input>
                </el-form-item>
                <el-form-item label="套餐菜品" class="setmealFood" required>
                    <div class="addDish">
                        <el-button v-if="dishTable.length == 0" type="primary" @click="openAddDish"> + 添加菜品</el-button>
                        <div v-if="dishTable.length != 0" class="content">
                          <el-button style="margin-bottom: 20px;" type="primary" @click="openAddDish"> + 添加菜品</el-button>
                          <div class="table">
                            <el-table :data="dishTable" style="width: 100%;">
                              <el-table-column label="名称" prop="name" width="180" align="center"></el-table-column>
                              <el-table-column label="原价" prop="price" width="180" align="center">
                                <template slot-scope="scope"> {{ Number(scope.row.price) / 100 }} </template>
                              </el-table-column>
                              <el-table-column label="份数" prop="copies" align="center">
                                <template slot-scope="scope">
                                  <el-input-number
                                    v-model="scope.row.copies"
                                    size="small"
                                    :min="1"
                                    :max="99"
                                    label="描述文字"
                                  ></el-input-number>
                                </template>
                              </el-table-column>
                              <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                  <el-button type="text" size="small" @click="delDishHandle(scope.$index)"> 删除 </el-button>
                                </template>
                              </el-table-column>
                            </el-table>
                          </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="套餐图片" required>
                    <!-- <el-upload class="avatar-uploader"
                          action="/api/common/upload"
                          :show-file-list="false"
                          :on-success="handleAvatarSuccess"
                          :before-upload="beforeUpload"
                          ref="">
                      <img v-if="imageUrl" :src="imageUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload> -->
                    <el-upload
                        class="avatar-uploader"
                        :on-preview="preview"
                        :on-remove="handleRemove"
                        :on-change="changeFile"
                        :before-upload="beforeUpload"
                        :on-exceed="onExceed"
                        :file-list="fileList"
                        action="#"
                        :limit="1"
                        :class="{ disabled: fileComputed }"
                        :http-request="upload"
                        >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-progress
                        v-if="showPercent"
                        style="width: 180px"
                        :percentage="percent"
                    />
                </el-form-item>
                <el-form-item label="套餐描述" prop="description">
                    <el-input
                        v-model="form.description"
                        type="textarea"
                        :row="3"
                        placeholder="套餐描述,最长200字"
                        maxlength="200">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goBack">取消</el-button>
                    <el-button type="primary" @click="submitForm('form')">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog
            title="添加菜品"
            class="addDishList"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose">
            <!-- dialog body 对话框主体部分-->
            <div class="addDishCon">
              <!-- 左边待选菜品 -->
              <div class="leftCont">
                <div
                  v-show="searchKey.trim() == ''"
                  class="tabBut">
                  <span
                    v-for="(item, index) in dishType"
                    :key="index"
                    :class="{act:index == keyInd}"
                    @click="checkTypeHandle(index, item.id)"
                  >{{ item.name }}</span>
                </div>
                <div class="tabList">
                  <div class="table">
                    <div v-if="dishAddList.length == 0" style="padding-left:10px">
                      暂无菜品!
                    </div>
                    <el-checkbox-group
                      v-if="dishAddList.length > 0"
                      v-model="checkedList"
                      @change="checkedListHandle">
                      <div
                        v-for="(item, index) in dishAddList"
                        :key="index"
                        class="items">
                        <el-checkbox
                          :key="index"
                          :label="item"
                          :checked="item.isChecked">
                          <div class="item">
                            <span style="flex:3;text-align: left;">{{ item.dishName }}</span>
                            <span>{{ item.status == 0 ? '停售' : '在售' }}</span>
                            <span>￥{{ Number(item.price)/100 }}</span>
                          </div>
                        </el-checkbox>
                      </div>
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
              <!-- 右边已选菜品 -->
              <div class="rightCont">
                <div class="tit">已选菜品({{ checkedList.length }})</div>
                <div class="items">
                  <div
                    v-for="(item, ind) in checkedList"
                    :key="ind"
                    class="item">
                    <span style="flex: 3;text-align:left">{{ item.dishName }}</span>
                    <span class="price">￥ {{ Number(item.price)/100 }} </span>
                    <span
                      class="del"
                      @click="delCheck(ind)">
                      <img
                        src="@/assets/icons/btn_clean@2x.png"
                        alt="">
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="addTableList">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getList } from '@/api/category'
import { queryDishList } from '@/api/dish'
import { addSetmeal, getSetmealInfo, updateSetmealInfo } from '@/api/setmeal'
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDXHp7CJON8sMcdQrHZcQ6bsvviIdiW2Hz',
  SecretKey: 'XmmjgSxMbfdQ1CAtNgkkY8YxBAtQhkY7'
})
export default {
  name: 'AddSetmeal',
  data () {
    return {
      form: {
        name: '',
        categoryId: '',
        price: '',
        code: '',
        image: '',
        description: '',
        status: true,
        idType: ''
      },
      rules: {
        name: {
          required: true,
          message: '请输入套餐名称',
          trigger: 'blur'
        },
        idType: {
          required: true,
          message: '请选择套餐分类',
          trigger: 'change'
        },
        price: {
          required: true,
          // 'message': '请输入套餐价格',
          validator: (rules, value, callback) => {
            if (!value) {
              callback(new Error('请填写菜品价格'))
            } else {
              const reg = /^\d+(\.\d{0,2})?$/
              if (reg.test(value)) {
                if (value < 10000) {
                  callback()
                } else {
                  callback(new Error('菜品价格小于10000'))
                }
              } else {
                callback(new Error('菜品价格格式只能为数字,且最多保留两位小数'))
              }
            }
          },
          trigger: 'blur'
        }
      },
      imageUrl: '',
      actiontype: '',
      // 已添加菜品的显示，绑定在table上
      dishTable: [],
      // 对话弹窗可视性
      dialogVisible: false,
      // 对话弹窗的搜索内容
      value: '',
      // 获取菜品分类列表
      dishType: [],
      // 对话框搜索词
      searchKey: '',
      keyInd: 0,
      dishAddList: [],
      checkList: [],
      // 获取套餐分类列表
      setmealList: [],
      // 已选的菜品列表
      checkedList: [],
      id: '',
      fileList: [],
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: null, // 确定上传图片的id
      showPercent: false, // 状态加载条
      percent: 0 // 进度条加载过程
    }
  },
  computed: {
    fileComputed () {
      return this.fileList.length === 1
    }
  },
  watch: {
    searchKey (value) {
      if (value.trim()) {
        this.getDishForName(this.searchKey)
      }
    },
    checkList (value) {
      this.checkedList = value
    }
  },
  created () {
    console.log('route:', this.$route)
    this.id = this.$route.query.id
    this.actiontype = this.id ? 'edit' : 'add'
    if (this.id) {
      this.init()
    }
    this.getDishType()
    this.getSetmealList()
  },
  methods: {
    delDishHandle (ind) {
      this.dishTable.splice(ind, 1)
      this.checkList.splice(ind, 1)
      console.log('checkList', this.checkList)
      console.log('dishTable', this.dishTable)
    },
    // 删除已选菜品
    delCheck (ind) {
      this.checkedList.splice(ind, 1)
    },
    // dialog-确认添加菜品到套餐，下一步显示
    addTableList () {
      this.dishTable = JSON.parse(JSON.stringify(this.checkList)) // 方便数据在后端进行处理
      this.dishTable.forEach((n) => {
        n.copies = 1
      })
      this.dialogVisible = false
      // 添加处理逻辑清空选中list
      // this.checkList = []
      console.log('dishTable:', this.dishTable)
    },
    checkTypeHandle (ind, id) {
      this.keyInd = ind
      this.getDishList(id)
    },
    // 点击添加菜品进入套餐
    checkedListHandle (value) {
      console.log('value', value)
      console.log(this.checkedList)
      // value.isChecked = true
      this.getCheckList(this.checkedList)
    },
    // 获取添加菜品数据
    getCheckList (value) {
      this.checkList = [...value]
    },

    // 获取套餐分类列表
    getSetmealList () {
      getList(2).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.setmealList = res.data.map(obj => ({
            ...obj,
            idType: obj.id
          }))
          console.log(this.setmealList)
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      })
    },
    // 获取菜品分类
    getDishType () {
      getList(1).then(res => {
        if (res.code === 200) {
          // console.log('获取分类', res)
          this.dishType = res.data
          this.getDishList(res.data[0].id)
        }
      })
    },
    // 获取某个菜品分类下的菜品列表
    getDishList (id) {
      queryDishList(id).then(res => {
        console.log('菜品分类的详细列表', res)
        if (res.code === 200) {
          if (res.data.length === 0) {
            this.dishAddList = []
          }
          const newArr = res.data
          newArr.forEach((item) => {
            item.dishId = item.id
            item.copies = 1
            item.dishName = item.name
            item.isChecked = false
          })
          this.dishAddList = newArr
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取菜品详细信息
    async init () {
      console.log('查询的套餐id:', this.id)
      const res = await getSetmealInfo(this.id)
      console.log('getSetmealInfo', res)
      if (res.code === 200) {
        this.form = { ...res.data }
        console.log('before.form', this.form)
        this.form.price /= 100
        this.form.idType = res.data.categoryId
        this.dishTable = res.data.setmealDishes
        this.checkList = res.data.setmealDishes
        // 图片回显
        // this.imageUrl = 'http://rkt7dnyi5.hn-bkt.clouddn.com/' + this.form.image
        this.imgUrl = 'https://delivery-1313364762.cos.ap-nanjing.myqcloud.com/' + this.form.image
        // this.fileList.push('https://delivery-1313364762.cos.ap-nanjing.myqcloud.com/' + this.form.image)
        this.imageUrl = 'https://delivery-1313364762.cos.ap-nanjing.myqcloud.com/' + this.form.image
      } else {
        this.$message.error(res.msg || '操作失败')
      }
    },

    // // 上传图片完成时执行的方法
    // handleAvatarSuccess (response, file, fileList) {
    //   this.form.image = response.data
    //   this.imageUrl = 'http://rkt7dnyi5.hn-bkt.clouddn.com/' + this.form.image
    // },

    // // 上传图片前执行
    // beforeUpload (file) {
    //   if (file) {
    //     const suffix = file.name.split('.')[1]
    //     const size = file.size / 1024 / 1024 < 2
    //     if (['png', 'jpeg', 'jpg'].indexOf(suffix) < 0) {
    //       this.$message.error('上传图片只支持 png、jpeg、jpg 格式！')
    //       this.$refs.upload.clearFiles()
    //       return false
    //     }
    //     if (!size) {
    //       this.$message.error('上传文件大小不能超过 2MB!')
    //       return false
    //     }
    //     return file
    //   }
    // },

    // 超出的回调
    onExceed () {
      this.$message.warning('当前仅支持上传一张图片')
    },
    // 预览图片时的回调
    preview (file) {
      // this.imgUrl = 'https://delivery-1313364762.cos.ap-nanjing.myqcloud.com/' + file.url // 点击预览时，传递图片地址给弹出层
      // this.imgUrl = file.url // 点击预览时，传递图片地址给弹出层
      this.imageUrl = file.url // 点击预览时，传递图片地址给弹出层
      this.showDialog = true
    },
    // 删除图片的回调
    handleRemove (file) {
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid)
    },
    // 修改图片的回调
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
      // 限制大小为2mb
      const maxSize = 2 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过2M')
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
              console.log('data:', data)
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
                  const realUrl = data.Location.substring(data.Location.lastIndexOf('/') + 1)
                  this.form.image = realUrl
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
              this.imageUrl = this.fileList[0].url
            }
          }
        )
      }
    },

    // 返回上一个页面
    goBack () {
      this.$router.back()
      this.$emit('change', '菜品管理', false)
    },
    submitForm (formName) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form)
          const params = { ...this.form }
          params.price *= 100
          params.setmealDishes = this.dishTable.map((obj) => ({
            copies: obj.copies,
            dishId: obj.dishId,
            name: obj.name,
            price: obj.price
          }))
          params.status = this.form ? 1 : 0
          params.categoryId = this.form.idType
          if (params.setmealDishes.length < 1) {
            this.$message.warning('请选择菜品')
            return
          }
          if (!this.imageUrl) {
            this.$message.error('请上传套餐图片')
          }
          if (this.actiontype === 'add') {
            addSetmeal(params).then(res => {
              if (res.code === 200) {
                this.$message.success('套餐添加成功！')
                this.goBack()
              } else {
                this.$message.error(res.msg || '操作失败')
                this.$refs.form.resetFields()
                this.dishTable = []
                this.form = {
                  name: '',
                  categoryId: '',
                  price: '',
                  code: '',
                  image: '',
                  description: '',
                  status: true,
                  id: '',
                  idType: ''
                }
                this.imageUrl = ''
              }
            }).catch(err => {
              this.$message.error('请求出错' + err)
            })
          } else {
            // 修改菜品信息
            updateSetmealInfo(params).then(res => {
              if (res.code === 200) {
                this.$message.success('套餐信息修改成功！')
                this.goBack()
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              this.$message.error('请求出错' + err)
            })
          }
        } else {
          return false
        }
      })
    },
    openAddDish () {
      this.dialogVisible = true
    },
    // 退出dialog
    handleClose () {
      this.dialogVisible = false
    },
    // 添加菜品的搜索
    searchHandle () {
      this.searchKey = this.value
    }
  }
}
</script>

<style lang="less" scoped>
.addBrand-container {
  margin: 30px;
  .container {
    padding: 30px;
    border-radius: 4px;
    min-height: 500px;
    background-color: #fff;
  }
  // 调整 el-input、el-select的框大小
}

// 菜品图片上传
.avatar-uploader {
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 160px;
    line-height: 160px;
    text-align: center;
    background: #fcfcfc;
  }
  // el-upload 虚线框
  /deep/ .el-upload {
    border: dashed 2px #d8dde3 !important;
    border-radius: 4px !important;
    background: #fcfcfc;
  }
  .avatar {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    cursor: pointer;
    line-height: 146px;
    vertical-align: top;
  }
}

.addDish .el-input {
  width: 130px;
}
.addDish .el-input-number__increase {
  border-left: solid 1px #FFE1CA;
  background: #fff3ea;
}
.addDish .el-input-number__decrease {
  border-right: solid 1px #FFE1CA;
  background: #fff3ea;
}
.addDish input {
  border: 1px solid #ffe1ca;
}
.addDish .table {
  border: solid 1px #EBEEF5;
  border-radius: 3px;
}
.addDish .table th {
  padding: 5px 0;
}
.addDish .table td {
  padding: 7px 0;
}
.addDishList .searchDish {
  position: absolute;
  top: 10px;
  right: 20px;
}
.addDishList .el-dialog__body {
  padding: 0;
  border-bottom: solid 1px #ccc;
}
.addDishList .el-dialog__footer {
  padding-top: 27px;
}

.addDish {
  width: 777px;
}
.addDish .addBut {
  background: #ffc200;
  display: inline-block;
  padding: 0px 20px;
  border-radius: 3px;
  line-height: 40px;
  cursor: pointer;
  border-radius: 4px;
  color: #333333;
  font-weight: 500;
}
.addDish .content {
  background: #fafafb;
  padding: 20px;
  border: solid 1px #ccc;
  border-radius: 3px;
}
.addDishCon {
  padding: 0 20px;
  display: flex;
  line-height: 40px;
}
.addDishCon .leftCont {
  display: flex;
  border-right: solid 2px #E4E7ED;
  width: 60%;
  padding: 15px;
}
.addDishCon .leftCont .tabBut {
  width: 110px;
}
.addDishCon .leftCont .tabBut span {
  display: block;
  text-align: center;
  border-right: solid 2px #f4f4f4;
  cursor: pointer;
}
.addDishCon .leftCont .act {
  border-color: #FFC200 !important;
  color: #FFC200 !important;
}
.addDishCon .leftCont .tabList {
  flex: 1;
  padding: 15px;

  .table {
    border: solid 1px #f4f4f4;
    border-bottom: solid 1px #f4f4f4;

    .items {
      border-bottom: solid 1px #f4f4f4;
      padding: 0 10px;
      display: flex;

      .item {
        display: flex;
        padding-right: 20px;

        span {
          display: inline-block;
          text-align: center;
          flex: 1;
        }
      }
    }
  }
}
.addDishCon .leftCont .tabList .table .items .el-checkbox,.addDishCon .leftCont .tabList .table .items /deep/ .el-checkbox__label{
  width: 100%;
}

.addDishCon .rightCont {
  width: 40%;
  padding: 0 15px;
}
.addDishCon .rightCont .item {
  box-shadow: 0px 1px 4px 3px rgba(0, 0, 0, 0.03);
  display: flex;
  text-align: center;
  padding: 0 10px;
  margin-bottom: 20px;
  border-radius: 6px;
  color: #818693;

  span:first-child {
    text-align: left;
    color: #20232A;
  }

  .price {
    display: inline-block;
    flex: 1;
  }

  .del {
    cursor: pointer;

    img {
      position: relative;
      top: 5px;
      width: 20px;
    }
  }
}

.addDish /deep/ .el-input-number__increase,
.addDish /deep/ .el-input-number__decrease {
    border-left: solid 1px #FFE1CA;
    background: #fff3ea;
}

/deep/ .el-input .el-input__inner:hover {
    border-color: #ffc200;
}
</style>
