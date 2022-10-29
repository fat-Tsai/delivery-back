<template>
  <div class="addBrand-container">
    <div class="container">
      <el-form :model="addEmployeeForm" ref="addEmployeeForm" :rules="rules" label-width="180px" class="demo-dynamic">
        <el-form-item
          prop="username"
          label="账号"
          :rules="rules.username"
        >
          <el-input v-model="addEmployeeForm.username" placeholder="请输入账号" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item
          prop="name"
          label="员工姓名"
          :rules="rules.name"
        >
          <el-input v-model="addEmployeeForm.name" placeholder="请输入员工姓名" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item
          prop="phone"
          label="手机号"
          :rules="rules.phone"
        >
          <el-input v-model="addEmployeeForm.phone" placeholder="请输入手机号" maxlength="20"></el-input>
        </el-form-item>
        <!-- 性别 -->
        <el-form-item
          prop="sex"
          label="性别"
          required
        >
          <el-radio-group v-model="addEmployeeForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="idNumber"
          label="身份证号"
          :rules="rules.idNumber"
        >
          <el-input v-model="addEmployeeForm.idNumber" placeholder="请输入身份证号" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="goBack">取消</el-button>
          <el-button type="primary" @click="submitForm('addEmployeeForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addEmployee, queryEmployeeById, editEmployee } from '@/api/employee.js'
import {
  checkUserName,
  checkName,
  checkPhone,
  validID
} from '@/api/validator.js'

export default {
  name: 'AddEmployee',
  data () {
    return {
      addEmployeeForm: {
        username: '',
        name: '',
        phone: '',
        sex: '1',
        idNumber: ''
      },
      rules: {
        username: [{ required: true, validator: checkUserName, trigger: 'blur' }],
        name: [{ required: true, validator: checkName, trigger: 'blur' }],
        phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        idNumber: [{ required: true, validator: validID, trigger: 'blur' }]
      },
      id: '',
      actiontype: ''
    }
  },
  created () {
    this.id = this.$route.query.id
    this.actiontype = this.id ? 'edit' : 'add'
    console.log(this.actiontype)
    if (this.id) {
      this.init()
    }
  },
  methods: {
    async init () {
      queryEmployeeById(this.id).then(res => {
        console.log('查询到员工信息：', res)
        if (res.code === 200) {
          this.addEmployeeForm = res.data
          // this.addEmployeeForm.sex = res.data.sex === '0' ? '女' : '男'
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      })
    },
    goBack () {
      this.$router.back()
      this.$emit('change', '员工管理', false)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.actiontype === 'add') {
            console.log(this.addEmployeeForm)
            addEmployee(this.addEmployeeForm).then(res => {
              if (res.code === 200) {
                this.$message.success('员工添加成功')
                this.$router.back()
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              this.$message.error('请求出错：' + err)
            })
          } else {
            editEmployee(this.addEmployeeForm).then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message.success('员工信息修改成功')
                this.goBack()
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              this.$message.error('请求失败:' + err)
            })
          }
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
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
  .el-input {
    width: 293px;
  }
}
// 调整输入框与下方的距离
.el-form-item {
    margin-bottom: 22px;
}
.el-form-item__content {
  margin-left: 180px;
}

</style>
