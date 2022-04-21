<template>
  <div class="body">
    <!--    头部菜单-->
    <div class="demo-input-size search">
      <el-input
        v-model="search"
        placeholder="请输入内容"
        clearable
        label="搜索"
      />
    </div>
    <el-button type="primary" class="searchBtn" @click="queryAllWithSearch">搜索</el-button>
    <!--    表格数据-->
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          fixed
          prop="userId"
          label="用户ID"
          width="150"
          hidden
        />
        <el-table-column
          fixed
          prop="username"
          label="用户名"
          width="150"
        />
        <el-table-column
          prop="phone"
          label="手机号"
          width="120"
        />
        <el-table-column
          prop="roles"
          label="角色"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag v-for="(v,k,i) in scope.row.roles" :key="i" class="tag" size="small" hit>{{ v.roleName }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="lockFlag"
          label="是否锁定"
          width="120"
          :formatter="lockToChinese"
        />
        <el-table-column
          prop="delFlag"
          label="是否删除"
          width="120"
          :formatter="delToChinese"
        />
        <el-table-column
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button size="small" @click="handleClick(scope.row)">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--    编辑页面-->
    <el-dialog :title="editTitle" :visible.sync="editPageVisible" class="dialog" @open="loadData">
      <el-form ref="userForm" :model="userForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="userForm.hasRole"
            multiple
            placeholder="请选择"
            @visible-change="showRoles"
          >
            <el-option
              v-for="v in userForm.allRoles"
              :key="v.roleId"
              :label="v.roleName"
              :value="v.roleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否锁定">
          <el-switch
            v-model="userForm.lockFlag"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="是否删除">
          <el-switch
            v-model="userForm.delFlag"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPageVisible = false">取 消</el-button>
        <el-button type="primary" @click="doUpt">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { queryAllRoles, queryAllUserWithRole, updateUser } from '@/api/user'
import store from '@/store'
import router from '@/router'

export default {
  data() {
    return {
      tableData: [],
      search: '',
      editPageVisible: false,
      editTitle: '',
      userForm: {
        allRoles: [],
        hasRole: []
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    handleClick(row) {
      this.editTitle = '编辑用户'
      this.editPageVisible = true
      // 值的复制
      this.userForm = JSON.parse(JSON.stringify(row))
    },
    lockToChinese(row) {
      if (row.lockFlag === '1') {
        return '是'
      } else {
        return '否'
      }
    },
    delToChinese(row) {
      if (row.delFlag === '1') {
        return '是'
      } else {
        return '否'
      }
    },
    init() {
      queryAllUserWithRole().then(res => {
        this.tableData = res.data
      })
    },
    queryAllWithSearch() {
      queryAllUserWithRole({ username: this.search }).then(res => {
        this.tableData = res.data
      })
    },
    doUpt() {
      const param = {
        user: this.userForm,
        hasRoles: this.userForm.hasRole
      }
      updateUser(param).then(res => {
        this.init()
        this.editPageVisible = false
        // 权限与侧边栏的动态更新
        store.dispatch('user/getInfo').then(data => {
          store.dispatch('permission/generateRoutes', data.roles).then(routers => {
            router.addRoutes(routers)
          })
        })
      })
    },
    loadData() {
      // 获取所有可选角色
      queryAllRoles().then(res => {
        //   this.userForm = {
        //     ...this.userForm,
        //     allRoles: res.data.data,
        //     hasRole: this.userForm.roles.map((role) => { return role.roleCode })
        //   }
        // })
        // this.userForm.allRoles = res.data.data
        // this.userForm.hasRole = this.userForm.roles.map((role) => { return role.roleCode })
        this.$set(this.userForm, 'allRoles', res.data)
        this.$set(this.userForm, 'hasRole', this.userForm.roles.map((role) => { return role.roleId }))
      })
    },
    showRoles(type) {

    }
  }
}
</script>

<style scoped>
  .body{
    margin: 20px;
  }
  .search{
    width: 200px;
    display: inline-block;
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .searchBtn{
    display: inline;
  }

  .tag{
    margin: 1px 1px;
    width:100px
  }
</style>
