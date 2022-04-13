<template>
  <div class="body">
    <div class="search">
      <label>角色名称</label>
      <el-input
        v-model="search_data"
        class="search_input"
        placeholder="请输入角色名称"
        clearable
      />
      <el-button type="primary" @click="search">搜索</el-button>
    </div>
    <div>
      <el-button type="primary" class="add_role_btn" @click="addRole">新增</el-button>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :cell-style="{padding:'2px 1px'}"
      >
        <el-table-column
          type="index"
          :index="indexMethod"
        />
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="220"
        />
        <el-table-column
          prop="roleCode"
          label="角色编码"
          width="220"
        />
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          width="220"
        />
        <el-table-column
          prop="delFlag"
          label="删除标识"
          width="300"
          :formatter="delFormat"
        />
        <el-table-column
          label="操作"
          width="220"
        >
          <template slot-scope="scope">
            <el-button size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="del(scope.row)">删除</el-button>
            <el-button size="small" @click="permission(scope.row)">权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--    新增/更新页面-->
    <el-dialog :title="title" :visible.sync="dialogTableVisible" @close="doClose">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="100px">
          <el-input v-model="form.roleName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色编码" label-width="100px">
          <el-input v-model="form.roleCode" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="form.roleDesc" autocomplete="off" />
        </el-form-item>
        <el-form-item label="删除标识" label-width="100px">
          <el-switch
            v-model="form.delFlag"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!--    权限分配-->
    <el-dialog
      title="权限分配"
      :visible.sync="tree_visible"
      width="30%"
      @close="closeTree"
      @open="loadPermission"
    >
      <el-tree
        ref="tree"
        class="permission_tree"
        :data="permission_tree"
        show-checkbox
        default-expand-all
        node-key="menuId"
        highlight-current
        :props="defaultProps"
        :default-checked-keys="checked_keys"
        @check="uptPermission"
      />
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Index',
  data() {
    return {
      search_data: '',
      tableData: [],
      title: '',
      dialogTableVisible: false,
      form: {
        roleName: '',
        roleCode: '',
        roleDesc: '',
        delFlag: '0'
      },
      permission_tree: [],
      tree_visible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      checked_keys: [],
      currentRoleId: ''
    }
  },
  created() {
    this.init('')
  },
  methods: {
    init(roleName) {
      axios.get('http://localhost:9001/sysRole/queryAll?roleName=' + roleName).then(res => {
        if (res.data.code === '200') {
          this.tableData = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    delFormat(row) {
      return row.delFlag === '1' ? '是' : '否'
    },
    search() {
      this.init(this.search_data)
    },
    indexMethod(index) {
      return index + 1
    },
    addRole() {
      this.title = '新增角色'
      this.dialogTableVisible = true
    },
    doClose() {
      this.form = {
        roleName: '',
        roleCode: '',
        roleDesc: '',
        delFlag: '0'
      }
      this.dialogTableVisible = false
    },
    doAdd() {
      axios.post('http://localhost:9001/sysRole/updateRole', this.form).then(res => {
        if (res.data.code === '200') {
          this.init('')
          this.dialogTableVisible = false
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    edit(row) {
      this.title = '编辑角色'
      this.dialogTableVisible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    del(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('http://localhost:9001/sysRole/delRole', { roleId: row.roleId }).then(res => {
          if (res.data.code !== '200') {
            this.$message.error(res.data.msg)
          } else {
            this.init('')
          }
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    permission(row) {
      this.currentRoleId = row.roleId
      this.tree_visible = true
    },
    loadPermission() {
      // 加载该角色所拥有的权限
      axios.get('http://localhost:9001/sysRoleMenu/queryRoleWithPermissions?roleId=' + this.currentRoleId).then(res => {
        this.checked_keys = res.data.data
        axios.get('http://localhost:9001/sysMenu/queryAllList').then(res => {
          this.permission_tree = res.data.data
        })
      })
    },
    closeTree() {
      this.checked_keys = []
      this.permission_tree = []
    },
    uptPermission(data, node) {
      // const checkedData = JSON.parse(JSON.stringify(node.checkedKeys))
      // const checked = checkedData.concat(node.halfCheckedKeys)
      // 获取半选中状态，也就是选中的本身和父菜单的ID
      axios.post('http://localhost:9001/sysRoleMenu/uptRollMenu', { roleId: this.currentRoleId, menuIds: JSON.parse(JSON.stringify(node.checkedKeys)) }).then(res => {
        if (res.data.code !== '200') {
          this.$message.error(res.data.msg)
        } else {
          this.loadPermission()
        }
      })
    }
  }
}
</script>

<style scoped>
  .body{
    margin: 20px;
    font-size: 10px;
  }

  .search{
    margin-left: 120px;
  }

  .add_role_btn{
    margin: 10px 0px;
  }

  .search_input{
    width: 266px;
    margin: 10px 10px 10px 20px;
  }

  .permission_tree{
    height: 70vh;
    overflow: auto;
  }
</style>
