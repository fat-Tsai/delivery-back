<template>
    <div class="dashboard-container">
      <div class="container">
        <!-- 头部搜索框+按钮 -->
        <div class="tablebar">
            <el-input
                placeholder="请输入套餐名称"
                v-model="searchMsg"
                clearable
                @keyup.enter.native="handleQuery"
                style="width: 250px">
                <i
                    slot="prefix"
                    class="el-input__icon el-icon-search"
                    style="cursor: pointer"
                    @click="handleQuery"></i>
            </el-input>
            <div class="tableLab">
                <span class="span-btn delBtn" @click="deleteHandle('批量',null)">批量删除</span>
                <span class="span-btn editBtn" @click="statusHandle(1)">批量起售</span>
                <span class="span-btn delBtn" @click="statusHandle(0)">批量停售</span>
                <el-button type="primary" @click="add">新增套餐</el-button>
            </div>
        </div>
        <!-- 中间表格数据填充 -->
        <el-table
          stripe
          :data="list"
          class="tableBox"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="25" align="center" class="selection"></el-table-column>
          <el-table-column label="菜品名称" prop="name"></el-table-column>
          <el-table-column label="图片" prop="image">
            <template slot-scope="{ row }">
            <el-image style="width: 40px; height: 40px; border:none;cursor: pointer;"
            :src="getImage(row.image)"
            :preview-src-list="[ `https://delivery-1313364762.cos.ap-nanjing.myqcloud.com/${row.image}` ]" >
            <div slot="error" class="image-slot">
              <img src="@/assets/noImg.png"  style="width: 40px; height: 40px; border:none;" >
            </div>
          </el-image>
          </template>
          </el-table-column>
          <el-table-column label="菜品分类"  prop="categoryName"></el-table-column>
          <el-table-column label="售价" prop="price">
            <template slot-scope="scope">{{ scope.row.price/100.00}}</template>
          </el-table-column>
          <el-table-column label="售卖状态"  prop="status">
            <template slot-scope="scope">{{ scope.row.status === 1 ? '在售' : '停售'}}</template>
          </el-table-column>
          <el-table-column label="最后操作时间"  prop="updateTime"></el-table-column>
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
                  @click="statusHandle(scope.row)"
                  >
                  {{ scope.row.status == '0' ? '启售' : '停售' }}
                </el-button>
              <el-button
                  size="mini"
                  type="text"
                  class="useBtn"
                  @click="deleteHandle('单个',scope.row.id)"
                  >删除</el-button>
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
    </div>
</template>

<script>
import { getSetmealList, updateSetmealStatus, deleteSetmeal } from '@/api/setmeal'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Setmeal',
  data () {
    return {
      list: [],
      page: 1,
      pageSize: 10,
      counts: 0,
      // 搜索框绑定的信息
      searchMsg: '',
      checkList: [],
      status: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    handleQuery () {
      this.page = 1
      this.init()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.page = val
      this.init()
    },
    add () {
      this.$router.push('/addSetmeal')
      this.$emit('change', '添加套餐', true)
    },
    // 修改 --菜品信息
    handleEdit (index, row) {
      this.$router.push({ path: '/addSetmeal', query: { id: row.id } })
      this.$emit('change', '修改套餐', true)
    },
    async init () {
      const res = await getSetmealList(this.page, this.pageSize, this.searchMsg)
      console.log('套餐管理的list:', res)
      if (res.code === 200) {
        this.list = res.data.records
        this.counts = res.data.total
      } else {
        this.$message.error(res.msg || '操作失败')
      }
    },

    // 修改菜品状态
    statusHandle (row) {
      console.log(typeof row)
      const params = {}
      // 分单个操作/批量操作,批量操作row为number,单个操作row为object
      // eslint-disable-next-line valid-typeof
      if (typeof row === 'number') {
        if (this.checkList.length === 0) {
          this.$message.warning('批量操作，请先勾选所需套餐')
          return false
        }
        params.ids = this.checkList.join(',')
        params.status = row
        console.log(params)
      } else {
        params.ids = row.id
        params.status = !row.status ? 1 : 0
        console.log(params)
      }
      this.$confirm('确认更改该菜品状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateSetmealStatus(params).then(res => {
          if (res.code === 200) {
            this.$message.success('套餐状态已经更改成功！')
            this.handleQuery()
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        }).catch(err => {
          this.$message.error('请求出错了：' + err)
        })
      })
    },

    // 删除菜品-- 这里是彻底删除，而不是逻辑删除
    deleteHandle (type, id) {
      console.log(`type:${type},id:${id}`)
      if (type === '批量' && this.checkList.length === 0) {
        this.$message.warning('批量操作，请先勾选所需菜品')
        return false
      }
      this.$confirm('确认删除该菜品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSetmeal(type === '批量' ? this.checkList.join(',') : id).then(res => {
          if (res.code === 200) {
            this.$message.success('菜品删除成功！')
            this.handleQuery()
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        }).catch(err => {
          this.$message.error('请求出错了：' + err)
        })
      })
    },
    // 设置选中行，用于批量操作
    handleSelectionChange (val) {
      // val指代选中的row,而这些row组成一个数组
      const checkArr = []
      val.forEach(element => {
        checkArr.push(element.id)
      })
      this.checkList = checkArr
    },
    getImage (image) {
      // return `http://rkt7dnyi5.hn-bkt.clouddn.com/${image}`
      return `https://delivery-1313364762.cos.ap-nanjing.myqcloud.com/${image}`
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
      .tableLab {
        .span-btn {
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            padding: 0 20px;
            color: #818693;
            border-right: solid 1px #d8dde3;
        }
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
.tableBox el-table__body-wrapper tbody tr .cell .el-checkbox {
  display: block;
}
.el-checkbox__input .el-checkbox__inner {
  display: block;
}
</style>
