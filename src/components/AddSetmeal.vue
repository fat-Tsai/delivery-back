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
                    <el-upload class="avatar-uploader"
                          action="/api/common/upload"
                          :show-file-list="false"
                          :on-success="handleAvatarSuccess"
                          :before-upload="beforeUpload"
                          ref="">
                      <img v-if="imageUrl" :src="imageUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
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
            <!-- <el-input
                placeholder="请输入菜品并按回车进行搜索"
                v-model="value"
                clearable
                @keyup.enter.native="handleQuery"
                style="width: 250px"
                class="searchDish">
                <i
                  slot="prefix"
                  class="el-input__icon el-icon-search"
                  style="cursor: pointer"
                  @click="searchHandle"></i>
            </el-input> -->
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
                          :label="item">
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
      id: ''
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
        this.imageUrl = 'http://rkt7dnyi5.hn-bkt.clouddn.com/' + this.form.image
      } else {
        this.$message.error(res.msg || '操作失败')
      }
    },

    // 上传图片完成时执行的方法
    handleAvatarSuccess (response, file, fileList) {
      this.form.image = response.data
      this.imageUrl = 'http://rkt7dnyi5.hn-bkt.clouddn.com/' + this.form.image
    },

    // 上传图片前执行
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
    },

    // 移除图片，注意：不管有没有移除图片都已经上传，这个地方需要优化
    handleRemove () {
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
    // handleQuery () {
    //   getDishList(1, 100, this.searchKey).then(res => {
    //     console.log('getDishList', res)
    //   })
    // }
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
