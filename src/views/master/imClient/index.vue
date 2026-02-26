<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="客户端名称" prop="clientName" label-width="100">
              <el-input v-model="queryParams.clientName" placeholder="请输入客户端名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['master:imClient:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['master:imClient:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['master:imClient:remove']">删除</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="imClientList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="客户端名称" align="center" prop="clientName" />
        <!-- <el-table-column label="客户端端口" align="center" prop="clientPort" />
        <el-table-column label="客户端api url" align="center" prop="clientApiUrl" /> -->
        <el-table-column label="操作" align="center" fixed="right"  class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="查看配置" placement="top">
              <el-button link type="primary" icon="Document" @click="handleViewConfig(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['master:imClient:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['master:imClient:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改im平台客户端对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" append-to-body>
      <el-form ref="imClientFormRef" :model="form" :rules="rules" label-width="130px">

        <el-form-item label="客户端名称" prop="clientName">
          <el-input v-model="form.clientName" placeholder="请输入客户端名称" />
        </el-form-item>
        <el-form-item label="客户端端口" prop="clientPort">
          <el-input v-model="form.clientPort" placeholder="请输入客户端端口" />
        </el-form-item>
        <el-form-item label="客户端api url" prop="clientApiUrl">
          <el-input v-model="form.clientApiUrl" placeholder="请输入客户端api url" />
        </el-form-item>
        <el-form-item label="客户端s3 key" prop="clientS3Key">
          <el-input v-model="form.clientS3Key" placeholder="请输入客户端s3 key" />
        </el-form-item>
        <el-form-item label="客户端s3 密钥" prop="clientS3Secret">
          <el-input v-model="form.clientS3Secret" placeholder="请输入客户端s3 密钥" />
        </el-form-item>
        <el-form-item label="客户端s3 桶" prop="clientS3Bucket">
          <el-input v-model="form.clientS3Bucket" placeholder="请输入客户端s3 桶" />
        </el-form-item>
        <el-form-item label="客户端s3 时区 ap-southeast-1 亚太" prop="clientS3Region">
          <el-input v-model="form.clientS3Region" placeholder="请输入客户端s3 时区" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 查看JSON配置对话框 -->
    <el-dialog title="客户端配置" v-model="configDialog.visible" width="800px" append-to-body>
      <div v-loading="configDialog.loading || configDialog.saving">
        <div v-if="configDialog.data && configDialog.data.length > 0">
          <div v-for="(item, index) in configDialog.data" :key="index" class="config-item mb-2">
            <el-row :gutter="10" align="middle">
              <el-col :span="2">
                <el-button circle size="small" icon="Delete" type="danger" @click="removeConfigItem(index)" />
              </el-col>
              <el-col :span="9">
                <el-input v-model="item.key" placeholder="配置项Key" />
              </el-col>
              <el-col :span="11">
                <el-input
                  v-if="!Array.isArray(item.value)"
                  v-model="item.value"
                  placeholder="配置项Value"
                />
                <div v-else class="array-values">
                  <div v-for="(arrItem, arrIndex) in item.value" :key="arrIndex" class="mb-1">
                    <el-row :gutter="5">
                      <el-col :span="20">
                        <el-input v-model="item.value[arrIndex]" placeholder="数组项值" size="small" />
                      </el-col>
                      <el-col :span="4">
                        <el-button circle size="small" icon="Delete" type="danger" @click="removeArrayItem(index, arrIndex)" />
                      </el-col>
                    </el-row>
                  </div>
                  <el-button size="small" icon="Plus" @click="addArrayItem(index)">添加数组项</el-button>
                </div>
              </el-col>
              <el-col :span="2">
                <el-button
                  v-if="!Array.isArray(item.value)"
                  circle
                  size="small"
                  icon="Top"
                  @click="convertToArray(index)"
                  title="转为数组"
                />
              </el-col>
            </el-row>
          </div>
        </div>
        <el-alert v-else title="暂无配置数据" type="info" :closable="false" />
        <el-button class="mt-3" icon="Plus" @click="addConfigItem">新增配置项</el-button>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="configDialog.visible = false">关 闭</el-button>
          <el-button type="primary" :loading="configDialog.saving" @click="saveConfig">保 存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ImClient" lang="ts">
import { listImClient, getImClient, delImClient, addImClient, updateImClient, getClientJson, updateAppUrl } from '@/api/master/imClient';
import { ImClientVO, ImClientQuery, ImClientForm } from '@/api/master/imClient/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const imClientList = ref<ImClientVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const imClientFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const configDialog = reactive<{
  visible: boolean;
  clientId: string | number | null;
  data: Array<{ key: string; value: string | string[] }>;
  loading: boolean;
  saving: boolean;
}>({
  visible: false,
  clientId: null,
  data: [],
  loading: false,
  saving: false
});

const initFormData: ImClientForm = {
  id: undefined,
  deptId: undefined,
  clientName: undefined,
  clientPort: undefined,
  clientApiUrl: undefined,
  clientS3Key: undefined,
  clientS3Secret: undefined,
  clientS3Bucket: undefined,
}
const data = reactive<PageData<ImClientForm, ImClientQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    clientName: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询im平台客户端列表 */
const getList = async () => {
  loading.value = true;
  const res = await listImClient(queryParams.value);
  imClientList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  imClientFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: ImClientVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加im平台客户端";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: ImClientVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getImClient(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改im平台客户端";
}

/** 提交按钮 */
const submitForm = () => {
  imClientFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateImClient(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addImClient(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ImClientVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除im平台客户端编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delImClient(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('master/imClient/export', {
    ...queryParams.value
  }, `imClient_${new Date().getTime()}.xlsx`)
}

/** 查看配置操作 */
const handleViewConfig = async (row: ImClientVO) => {
  configDialog.clientId = row.id;
  configDialog.visible = true;
  configDialog.loading = true;
  configDialog.data = [];
  try {
    const res = await getClientJson(row.id);
    if (res.code === 200 && res.msg) {
      const parsedData = JSON.parse(res.msg);
      configDialog.data = Object.entries(parsedData).map(([key, value]) => ({ key, value }));
    } else {
      configDialog.data = [];
    }
  } catch (error) {
    proxy?.$modal.msgError('获取配置失败');
    configDialog.data = [];
  } finally {
    configDialog.loading = false;
  }
}

/** 添加配置项 */
const addConfigItem = () => {
  configDialog.data.push({ key: '', value: '' });
}

/** 删除配置项 */
const removeConfigItem = (index: number) => {
  configDialog.data.splice(index, 1);
}

/** 转为数组 */
const convertToArray = (index: number) => {
  if (!Array.isArray(configDialog.data[index].value)) {
    configDialog.data[index].value = [configDialog.data[index].value || ''];
  }
}

/** 添加数组项 */
const addArrayItem = (index: number) => {
  if (Array.isArray(configDialog.data[index].value)) {
    configDialog.data[index].value.push('');
  }
}

/** 删除数组项 */
const removeArrayItem = (index: number, arrIndex: number) => {
  if (Array.isArray(configDialog.data[index].value)) {
    configDialog.data[index].value.splice(arrIndex, 1);
  }
}

/** 保存配置 */
const saveConfig = async () => {
  if (!configDialog.data || configDialog.data.length === 0) return;

  await proxy?.$modal.confirm('将会同步到远程文件上是否继续操作？');

  configDialog.saving = true;
  try {
    const requestData: Record<string, any> = {
      clientId: configDialog.clientId
    };

    configDialog.data.forEach(({ key, value }) => {
      if (!key) return;
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      requestData[camelKey] = value;
    });

    await updateAppUrl(requestData);
    proxy?.$modal.msgSuccess('保存成功');
    configDialog.visible = false;
  } catch (error) {
    // 用户取消或请求失败
  } finally {
    configDialog.saving = false;
  }
}

onMounted(() => {
  getList();
});
</script>
