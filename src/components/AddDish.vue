<template>
    <div class="addBrand-container">
        <div class="container">
            <el-form ref="form" :model="form" label-width="180px">
                <el-form-item
                    label="菜品分类:"
                    prop="categpryId">
                    <el-select
                        v-model="form.categoryId"
                        placeholder="请选择菜品分类">
                        <el-option v-for="item in dishList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="菜品名称" required>
                    <el-input v-model="form.name" placeholder="请填写菜品名称"></el-input>
                </el-form-item>
                <el-form-item label="菜品价格" required>
                    <el-input v-model="form.price" placeholder="请设置菜品价格"></el-input>
                </el-form-item>
                <el-form-item label="口味做法配置" prop="flavors">
                  <div class="flavorBox">
                    <span
                      v-if="dishFlavors.length == 0"
                      class="addBtn"
                      @click="addFlavore"
                    > + 添加口味</span>
                    <div
                      v-if="dishFlavors.length != 0"
                      class="flavor"
                    >
                      <div class="title">
                        <span>口味名（3个字内）</span><span>口味标签（输入标签回车添加）</span>
                      </div>
                      <div class="cont">
                        <div
                          v-for="(item, index) in dishFlavors"
                          :key="index"
                          class="items"
                        >
                          <div class="itTit">
                            <div class="selectInput">
                              <div>
                                <el-input
                                    v-model="item.name"
                                    type="text"
                                    style="width: 100%"
                                    placeholder="请选择口味"
                                    @focus="selectFlavor(true,index)"
                                    @blur="outSelect(false,index)"
                                    @input="inputHandle(index)"
                                  />
                              </div>
                              <div v-show="item.showOption" class="flavorSelect">
                                <span
                                  v-for="(it, ind) in dishFlavorsData"
                                  :key="ind"
                                  class="items"
                                  @click="checkOption(it,ind,index)"
                                >{{ it.name }}</span>
                                <span
                                  v-if="dishFlavorsData == []"
                                  class="none"
                                >无数据</span>
                              </div>
                            </div>
                          </div>
                          <div class="labItems">
                            <span
                              v-for="(it, ind) in item.value"
                              :key="ind"
                            >{{ it }} <i @click="delFlavorLabel(index, ind)">X</i></span>
                            <div
                              class="inputBox"
                              contenteditable="true"
                              @focus="flavorPosition(index)"
                              @keydown.enter="(val)=>keyDownHandle(val,index)"
                            ></div>
                          </div>
                          <span
                            class="delFlavor delBtn"
                            @click="delFlavor(index)"
                          >删除</span>
                        </div>
                      </div>
                      <div class="addBtn" @click="addFlavore">添加口味</div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="菜品图片" required>
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
                <el-form-item label="菜品描述" prop="description">
                    <el-input
                        v-model="form.description"
                        type="textarea"
                        :row="3"
                        placeholder="菜品描述,最长200字"
                        maxlength="200">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goBack">取消</el-button>
                    <el-button type="primary" @click="submitForm('form')">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { getList } from '@/api/category'
import { addDish, getDishInfo, updateDish } from '@/api/dish'
export default {
  name: 'AddDish',
  data () {
    return {
      form: {
        name: '',
        price: '',
        code: '',
        image: '',
        description: '',
        flavors: [],
        status: true,
        categoryId: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写菜品名称', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择菜品分类', trigger: 'change' }
        ],
        price: [
          {
            required: true,
            // 'message': '请填写菜品价格',
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
        ]
      },
      dialogVisible: false,
      // 菜品分类列表
      dishList: [],
      // 图片地址
      imageUrl: '',
      // 可供选择的口味
      dishFlavorsData: [],
      // 上传到后端的口味
      dishFlavors: [],
      id: '',
      actiontype: ''
    }
  },
  created () {
    console.log('route:', this.$route)
    this.id = this.$route.query.id
    this.actiontype = this.id ? 'edit' : 'add'
    if (this.id) {
      this.init()
    }
    this.getDishList()
    this.getFlavorListHand()
  },
  methods: {
    // 获取菜品详细信息
    async init () {
      const res = await getDishInfo(this.id)
      console.log(res)
      if (res.code === 200) {
        this.form = { ...res.data }
        this.form.price /= 100
        this.dishFlavors = res.data.flavors && res.data.flavors.map(obj => ({ ...obj, value: JSON.parse(obj.value), showOption: false }))
        // 图片回显
        this.imageUrl = this.form.image
        console.log('form.categoryId:', this.form)
      } else {
        this.$message.error(res.msg || '操作失败')
      }
    },
    // 获取菜品分类列表
    getDishList () {
      getList(1).then(res => {
        if (res.code === 200) {
          this.dishList = res.data
          console.log(this.dishList)
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      })
    },

    // 获取口味列表
    getFlavorListHand () {
      // flavor flavorData
      this.dishFlavorsData = [
        { name: '甜味', value: ['无糖', '少糖', '半糖', '多糖', '全糖'] },
        { name: '温度', value: ['热饮', '常温', '去冰', '少冰', '多冰'] },
        { name: '忌口', value: ['不要葱', '不要蒜', '不要香菜', '不要辣'] },
        { name: '辣度', value: ['不辣', '微辣', '中辣', '重辣'] },
        { name: '分量', value: ['正常', '大份'] }
      ]
    },

    // 上传图片完成时执行的方法
    handleAvatarSuccess (response, file, fileList) {
      this.imageUrl = `/api/common/download?name=${response.data}`
      console.log(this.imageUrl)
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
          const params = { ...this.form }
          params.status = this.form ? 1 : 0
          params.price *= 100
          params.categoryId = this.form.categoryId
          params.flavors = this.dishFlavors.map(obj => ({ ...obj, value: JSON.stringify(obj.value) }))
          if (!this.imageUrl) {
            this.$message.error('请上传菜品图片')
          } else {
            params.image = this.imageUrl
          }
          if (this.actiontype === 'add') {
            addDish(params).then(res => {
              if (res.code === 200) {
                this.$message.success('菜品添加成功！')
                this.goBack()
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              this.$message.error('请求出错' + err)
            })
          } else {
            // 修改菜品信息
            updateDish(params).then(res => {
              if (res.code === 200) {
                this.$message.success('菜品信息修改成功！')
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
    // 按钮 - 添加口味
    addFlavore () {
      this.dishFlavors.push({ name: '', value: [], showOption: false }) // JSON.parse(JSON.stringify(this.dishFlavorsData))
    },

    // 按钮 - 删除口味
    delFlavor (ind) {
      this.dishFlavors.splice(ind, 1)
    },

    // 按钮 - 删除口味标签
    delFlavorLabel (index, ind) {
      this.dishFlavors[index].value.splice(ind, 1)
    },

    // 口味位置记录
    flavorPosition (index) {
      this.index = index
    },

    selectFlavor (st, index) {
      console.log('focus')
      console.log('st', st)
      console.log('index', index)
      console.log('this.dishFlavors', this.dishFlavors)
      const obj = JSON.parse(JSON.stringify(this.dishFlavors[index]))
      obj.showOption = st
      this.dishFlavors.splice(index, 1, obj)
      // this.dishFlavors[index].showOption = st
    },

    outSelect (st, index) { // st默认false不选择
      console.log('blur')
      console.log('st', st)
      console.log('index', index)
      console.log('this.dishFlavors', this.dishFlavors)
      const _this = this
      setTimeout(() => {
        const obj = JSON.parse(JSON.stringify(_this.dishFlavors[index]))
        obj.showOption = st
        _this.dishFlavors.splice(index, 1, obj)
      }, 200)
    },

    // 已有的口味不满足，自己添加
    inputHandle (val, index) {
      // this.selectFlavor(false,index)
    },
    // 添加口味标签
    keyDownHandle (val, index) {
      console.log('keyDownHandle----val', val)
      console.log('keyDownHandle----index', index)
      console.log('keyDownHandle----this.dishFlavors', this.dishFlavors)
      if (event) {
        event.cancelBubble = true
        event.preventDefault()
        event.stopPropagation()
      }

      if (val.target.innerText.trim() !== '') {
        this.dishFlavors[index].value.push(val.target.innerText)
        val.target.innerText = ''
      }
    },
    checkOption (val, ind, index) {
      this.selectHandle(val.name, index, ind)
      this.dishFlavors[index].name = val.name
    },

    selectHandle (val, key, ind) {
      const arrDate = [...this.dishFlavors]
      arrDate[key] = JSON.parse(JSON.stringify(this.dishFlavorsData[ind]))
      this.dishFlavors = arrDate
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

.flavorBox {
  width: 777px;

  // 添加口味按钮
  .addBtn {
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

  .flavor {
    border: solid 1px #dfe2e8;
    border-radius: 3px;
    padding: 15px;
    background: #fafafb;

    .title {
      color: #606168;
      font-size: 14px;
    }

    .cont {
      // 这里是口味的选择
      .items {
        display: flex;
        margin: 10px 0;

        .itTit {
          width: 150px;
          margin-right: 15px;

          .selectInput {
            position: relative;
            width: 100%;
            min-width: 100px;
          }

          .flavorSelect {
            position: absolute;
            width: 100%;
            padding: 0 10px;
            border-radius: 3px;
            border: solid 1px #FF903D;
            line-height: 30px;
            text-align: center;
            background: #fff;
            top: 50px;
            z-index: 99;

            .items {
              cursor: pointer;
              display: inline-block;
              width: 100%;
              line-height: 35px;
              border-bottom: solid 1px #f4f4f4;
              color: #666;
            }

            .none {

            }
          }

        }

        .labItems {
          display: flex;
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          border-radius: 3px;
          min-height: 39px;
          border: solid 1px #d8dde3;
          background: #fff;
          padding: 0 5px;

          span {
            display: inline-block;
            color: #f19c59;
            margin: 5px;
            line-height: 26px;
            height: 26px;
            padding: 0 10px;
            background: #fdf4eb;
            border-radius: 3px;
            border: solid 1px #fae2cd;

            i {
              cursor: pointer;
              font-style: normal;
            }
          }
          inputBox {
            display: inline-block;
            width: 100%;
            height: 36px;
            line-height: 36px;
            overflow: hidden;
            flex: 1;
          }
        }

        .delFlavor {
          display: inline-block;
          padding: 0 10px;
          color: #f19c59;
          cursor: pointer;
        }
      }
    }
  }
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

</style>
