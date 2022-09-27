<template>
    <div class="dashboard-container">
      <div class="container">
        <!-- 头部搜索框+按钮 -->
        <div class="tablebar">
            <el-input
                placeholder="请输入员工姓名"
                v-model="input"
                clearable
                @keyup.enter.native="handleQuery"
                style="width: 250px">
                <i
                    slot="prefix"
                    class="el-input__icon el-icon-search"
                    style="cursor: pointer"
                    @click="handleQuery"></i>
            </el-input>
            <el-button type="primary" @click="addEmployeeHandle">添加员工</el-button>
        </div>
        <!-- 中间表格数据填充 -->
        <el-table
          stripe
          :data="list">
          <!-- 表头数据-- 员工姓名 -->
          <el-table-column
            label="员工姓名"
            prop="name">
          </el-table-column>
          <!-- 表头数据-- 账号 -->
          <el-table-column
            label="员工姓名"
            prop="name">
          </el-table-column>
          <!-- 表头数据-- 手机号 -->
          <el-table-column
            label="手机号"
            prop="name">
          </el-table-column>
          <!-- 表头数据-- 账号状态 -->
          <el-table-column
            label="账号状态"
            prop="name">
          </el-table-column>
          <!-- 表头数据-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="text"
                  class="editBtn"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                  size="mini"
                  type="text"
                  class="delBtn"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 底部分页 -->
        <!-- <el-pagination
          class="pageList"
          :page-sizes="[10,20,30,40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="counts"
          :current-page.sync="page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination> -->
      </div>
    </div>
</template>

<script>
export default {
  name: 'EmployeeManage',
  data () {
    return {
      input: '',
      list: [
        { name: '414' },
        { name: '460' }
      ],
      page: 1,
      counts: 10
    }
  },
  methods: {
    // 搜索方法
    handleQuery () {
      console.log('开始搜索了')
    },
    // 跳转到添加员工页面
    addEmployeeHandle () {
      this.$router.push('/addEmployee')
      this.$emit('change', '添加员工', true)
      // this.$emit('flagChange', true)
    },
    handleEdit () {
      // 编辑
    },
    handleDelete () {
      // 删除
    }
  }
}
</script>

<style lang="less" scoped>
  .dashboard-container {
    padding: 20px;
    .container {
      padding: 30px 28px;
      background-color: #fff;
      .tablebar {
        display: flex;
        margin-bottom: 20px;
        justify-content: space-between;
      }
      .pageList {
        text-align: center;
        margin-top: 30px;
      }
    }
  }

</style>
