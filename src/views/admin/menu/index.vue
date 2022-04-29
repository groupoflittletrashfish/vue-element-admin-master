<template>
  <div class="body">
    <el-button type="primary" class="add" @click="addMainMenu">新增</el-button>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="menuId"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="menuId"
        label="菜单ID"
        sortable
        width="220"
      />
      <el-table-column
        prop="name"
        label="菜单名称"
        sortable
        width="180"
      />
      <el-table-column
        prop="type"
        label="菜单类型"
        sortable
        width="180"
      />
      <el-table-column
        prop="permission"
        label="权限标识"
        sortable
        width="180"
      />
      <el-table-column
        prop="sortOrder"
        label="排序"
        sortable
        width="180"
      />
      <el-table-column
        prop="path"
        label="路由"
      />
      <el-table-column
        prop="serviceUrl"
        label="请求地址"
      />
      <el-table-column
        prop="icon"
        label="图标"
      >
        <template slot-scope="scope">
          <svg-icon icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="scope.row.type==='1'"
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    新增/编辑菜单-->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      @close="doClose"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单类型">
          <el-radio-group v-model="form.type" :disabled="form.radioDisabled" @change="changeType">
            <el-radio-button label="0">菜单</el-radio-button>
            <el-radio-button label="1">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="路由" :hidden="!isMenu">
          <el-input v-model="form.path" />
        </el-form-item>
        <el-form-item label="权限标识" :hidden="isMenu">
          <el-input v-model="form.permission" />
        </el-form-item>
        <el-form-item label="后端地址" :hidden="isMenu">
          <el-input v-model="form.serviceUrl" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :max="999" label="" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMenu(form.menuId)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delMenu, queryMenuTree, updateMenu } from '@/api/user'
import store from '@/store'
import router from '@/router'
import VueRouter from 'vue-router'

export default {
  name: 'Index',
  data() {
    return {
      tableData: [],
      title: '',
      dialogVisible: false,
      isMenu: true,
      form: {
        menuId: '',
        name: '',
        path: '',
        type: 0,
        sortOrder: 999,
        hideMenu: false,
        radioDisabled: true,
        permission: '',
        serviceUrl: '',
        parentId: -1
      },
      // 表格当前被选中的行的菜单ID
      currentMenuId: -1
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      queryMenuTree().then(res => {
        this.tableData = res.data
      })
    },
    addMainMenu() {
      this.title = '新增菜单'
      this.dialogVisible = true
      this.form.type = 0
      this.isMenu = true
      this.form.parentId = -1
    },
    handleEdit(index, row) {
      this.title = '编辑菜单'
      this.dialogVisible = true
      this.form.menuId = row.menuId
      this.form.name = row.name
      this.form.path = row.path
      this.form.sortOrder = row.sortOrder
      this.form.type = row.type
      this.form.permission = row.permission
      this.form.serviceUrl = row.serviceUrl
      this.form.parentId = row.parentId
      this.isMenu = row.type === '0'
    },
    handleDelete(index, row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMenu({ menuId: row.menuId }).then(res => {
          this.init()

          this.$message({
            type: 'success',
            message: '删除成功!'
          })

          // 刷新侧边栏
          const accessRoutes = store.dispatch('permission/generateRoutes')
          router.addRoutes(accessRoutes)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveMenu() {
      const param = {
        menuId: this.form.menuId,
        name: this.form.name,
        path: this.form.path,
        parentId: this.form.parentId,
        sortOrder: this.form.sortOrder,
        permission: this.form.permission,
        serviceUrl: this.form.serviceUrl,
        keepAlive: 0,
        type: this.form.type,
        delFlag: 0
      }
      updateMenu(param).then(res => {
        this.init()
        this.dialogVisible = false
        // 刷新侧边栏
        // 获取用户的身份信息
        store.dispatch('user/getInfo').then(data => {
          // 获取后端的路由信息
          store.dispatch('permission/generateRoutes', data.roles).then(routers => {
            // matcher其实就是保存路由的具体信息，如果不先清空就会报出警告，也就是路由重复警告
            router.matcher = new VueRouter().matcher
            // 添加路由
            router.addRoutes(routers)
          })
        })
      })
    },
    doClose() {
      this.form = { radioDisabled: true, sortOrder: 999, name: '', path: '', permission: '', serviceUrl: '', type: 0 }
      this.currentMenuId = -1
      this.init()
    },
    handleAdd(row) {
      this.title = '新增菜单'
      this.dialogVisible = true
      this.form.radioDisabled = false
      this.form.type = 1
      this.form.parentId = row.menuId
      this.isMenu = false
      this.currentMenuId = row.menuId
    },
    changeType(data) {
      this.isMenu = data === '0'
    }
  }
}
</script>

<style scoped>
  .body{
    margin:20px
  }
  .add{
    margin-bottom: 5px;
  }
</style>
