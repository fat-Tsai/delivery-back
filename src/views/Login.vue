<template>
    <div class="login-container">
        <div class="box">
            <div class="left">
                <el-image
                    :src="require('../assets/login/login-l.png')"
                    fit="scale-down"
                    class="feature"
                    lazy></el-image>
            </div>
            <div class="right">
                <el-form ref="form" :model="form" class="login-form" :rules="rules">
                    <!-- logo -->
                    <div class="login-form-title">
                        <img src="../assets/login/logo.png" alt="">
                    </div>
                    <!-- 用户名 -->
                    <el-form-item prop="username">
                        <el-input
                            v-model="form.username"
                            prefix-icon="el-icon-user"
                            placeholder="账号"
                            clearable
                            auto-complete="off"
                            ></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item prop="password">
                        <el-input
                            v-model="form.password"
                            prefix-icon="el-icon-lock"
                            type="password"
                            maxlength="20"
                            minlength="4"
                            placeholder="密码"
                            clearable
                            show-password
                            auto-complete="off"
                            @keyup.enter.native="submit"
                            ></el-input>
                    </el-form-item>
                    <!-- 提交按钮 -->
                    <div class="login-btn">
                        <el-button
                            round
                            type="primary"
                            @click="submit"
                            >登录</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { login } from '@/api/login.js'
import { mapMutations } from 'vuex'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    ...mapMutations(['updateUserInfo']),
    async submit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          const res = await login(this.form)
          console.log(res)
          if (res.code === 200) { // 表示登录成功
            // 在网页端存储用户信息 现在后端是用的session 后面考虑使用token+Vuex
            this.updateUserInfo(JSON.stringify(res.data))
            this.$message.success('登录成功')
            this.$router.replace('/home')
          } else {
            this.$message.error(res.msg)
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #333;
        .box {
            width: 1000px;
            height: 479.54px;
            display: flex;
            border-radius: 10px;
            background-color: #fff;
            .left {
                width: 60%;
                height: auto;
            }
            .right {
                width: 40%;
                display: flex;
                justify-content: center;
                align-content: center;
                .login-form {
                    width: 241px;
                    height: 307px;
                    padding-bottom: 30px;
                    padding: 70px 26px 20px 26px;
                }
            }
        }
    }
    .login-form-title {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 40px;
        img {
            width: 139px;
            height: 42px;
        }
    }
    .login-btn {
        border-radius: 17px;
        margin-top: 15px;
        font-weight: 500;
        font-size: 14px;
        border: 0;
        display: flex;
        justify-content: center;
        align-content: center;
    }
</style>
