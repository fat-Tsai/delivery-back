<template>
    <div class="dashboard-container">
      <div class="container">
        <!-- 头部按钮 -->
        <div class="tablebar">
            <el-button type="primary" @click="add('class')" class="continue">新增菜品分类</el-button>
            <el-button type="primary" @click="add('meal')">新增套餐分类</el-button>
        </div>
        <!-- 中间表格数据填充 -->
        <el-table
          stripe
          :data="list"
          class="tableBox">
          <el-table-column label="分类名称" prop="name"></el-table-column>
          <el-table-column label="分类类型">
            <template slot-scope="scope">{{ scope.row.type === 1 ? "菜品分类" : "套餐分类"}}</template>
          </el-table-column>
          <el-table-column label="操作时间"  prop="updateTime"></el-table-column>
          <el-table-column label="排序" prop="sort"></el-table-column>
          <!-- 表头数据-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="text"
                  class="editBtn"
                  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button
                  size="mini"
                  type="text"
                  class="delBtn"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 底部分页 -->
        <el-pagination
          class="pageList"
          :page-sizes="[10,20,30,40,50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="counts"
          :current-page.sync="page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <!-- 对话弹窗 -->
      <el-dialog
        :title="dialogData.title"
        :visible.sync="dialogData.visible"
        width="30%"
        :before-close="handleClose">
        <el-form
          class="demo-form-inline"
          label-width="100px">
          <el-form-item label="分类名称">
            <el-input
              v-model="dialogData.name"
              placeholder="请输入分类名称"
              maxlength="14"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input
              v-model="dialogData.sort"
              type="number"
              placeholder="请输入排序"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import { addCategory, getCategotyList, delCategory, updateCategory } from '@/api/category.js'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Category',
  data () {
    return {
      list: [],
      counts: 0,
      page: 1,
      pageSize: 10,
      // 弹窗的信息
      dialogData: {
        title: '添加菜品分类',
        visible: false,
        id: '',
        name: '',
        sort: '',
        action: ''
      },
      type: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    add (st) {
      if (st === 'class') {
        this.dialogData.title = '新增菜品分类'
        this.type = 1
      } else {
        this.dialogData.title = '新增套餐分类'
        this.type = 2
      }
      this.dialogData.action = 'add'
      this.dialogData.name = ''
      this.dialogData.sort = ''
      this.dialogData.visible = true
    },
    async init () {
      await getCategotyList(this.page, this.pageSize).then(res => {
        console.log('categoryList:', res)
        if (res.code === 200) {
          this.list = res.data.records
          this.counts = res.data.total
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      }).catch(err => {
        this.$message.error('请求出错：' + err)
      })
    },
    submit () {
      const classData = {
        name: this.dialogData.name,
        type: this.type,
        sort: this.dialogData.sort
      }
      console.log('classData:', classData)
      const valid = (classData.name === 0 || classData.name) && (classData.sort === 0 || classData.sort)
      if (this.dialogData.action === 'add') {
        if (valid) {
          const reg = /^\d+$/
          if (reg.test(classData.sort)) {
            addCategory(classData).then(res => {
              console.log('添加菜品：', res)
              if (res.code === 200) {
                this.$message.success('分类添加成功')
                this.dialogData.visible = false
                this.handleRefresh()
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              this.$message.error('请求出错：' + err)
            })
          }
        }
      } else if (valid) {
        const reg = /^\d+$/
        if (reg.test(this.dialogData.sort)) {
          const params = {
            id: this.dialogData.id,
            name: this.dialogData.name,
            sort: this.dialogData.sort
          }
          console.log('params:', params)
          updateCategory(params).then(res => {
            if (res.code === 200) {
              this.$message.success('分类修改成功！')
              this.dialogData.visible = false
              this.handleRefresh()
            } else {
              this.$message.error(res.msg || '操作失败')
            }
          }).catch(err => {
            this.$message.error('请求出错了：' + err)
          })
        }
      }
    },
    handleRefresh () {
      this.page = 1
      this.init()
    },
    handleDelete (index, row) {
      console.log(this.list[index])
      const id = this.list[index].id
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('id:', id)
        console.log('id的类型:', typeof id)
        delCategory(id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.handleRefresh()
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        }).catch(err => {
          this.$message.error('请求失败：' + err)
        })
      })
    },
    handleClose () {
      this.dialogData.visible = false
    },
    handleEdit (index, row) {
      this.dialogData.title = '修改分类'
      this.dialogData.id = row.id
      this.dialogData.name = row.name
      this.dialogData.sort = row.sort
      this.dialogData.action = 'edit'
      this.dialogData.visible = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.page = val
      this.init()
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
      .continue {
        border-color: #333333 !important;
        background: #333333 !important;
        color: #ffffff !important;
      }
      .continue:hover {
        background-color: #999999 !important;
        border-color: #999999 !important;
        color: #ffffff !important;
      }
      .continue:active {
        background-color: #2a2a2a !important;
        border-color: #2a2a2a !important;
        color: #ffffff !important;
      }
    }
    .tableBox {
      font-size: 13px;
    }
    .pageList {
      text-align: center;
      margin-top: 30px;
    }
  }
}
.el-table td, .el-table th {
  padding: 12px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;  // 左对齐
}
.el-table .cell, .el-table th div {
  padding-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
