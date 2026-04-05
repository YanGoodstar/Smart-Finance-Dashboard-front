<script setup lang="ts">
import { computed, ref } from 'vue'
import type { UploadInstance, UploadProps } from 'element-plus'
import { DocumentDelete, UploadFilled } from '@element-plus/icons-vue'
import { importSourceOptions } from '@/constants/options'
import type { ImportSourceType } from '@/types/import-job'

const props = withDefaults(
  defineProps<{
    sourceType: ImportSourceType
    fileName?: string
    fileSizeLabel?: string
    uploading?: boolean
  }>(),
  {
    fileName: '',
    fileSizeLabel: '',
    uploading: false,
  },
)

const emit = defineEmits<{
  'update:sourceType': [value: ImportSourceType]
  'file-picked': [file: File | null]
  submit: []
}>()

const uploadRef = ref<UploadInstance>()

const hasFile = computed(() => Boolean(props.fileName))

const handleChange: UploadProps['onChange'] = (uploadFile) => {
  if (!uploadFile.raw) {
    return
  }
  emit('file-picked', uploadFile.raw as File)
  window.setTimeout(() => uploadRef.value?.clearFiles(), 0)
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  const nextFile = files[0]
  if (!nextFile) {
    return
  }
  emit('file-picked', nextFile as unknown as File)
  window.setTimeout(() => uploadRef.value?.clearFiles(), 0)
}

function clearSelectedFile() {
  uploadRef.value?.clearFiles()
  emit('file-picked', null)
}
</script>

<template>
  <section class="sf-card sf-panel upload-panel">
    <h2 class="sf-section-title">选择账单文件</h2>

    <div class="upload-panel__form">
      <label class="upload-panel__label">
        来源类型
        <el-select
          :model-value="sourceType"
          placeholder="请选择来源类型"
          @update:model-value="emit('update:sourceType', $event)"
        >
          <el-option
            v-for="option in importSourceOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </label>

      <el-upload
        ref="uploadRef"
        drag
        :auto-upload="false"
        :show-file-list="false"
        :limit="1"
        class="upload-panel__uploader"
        @change="handleChange"
        @exceed="handleExceed"
      >
        <el-icon class="upload-panel__icon"><UploadFilled /></el-icon>
        <div class="upload-panel__headline">拖拽或点击选择账单文件</div>
        <div class="upload-panel__tip">
          支持支付宝和微信账单文件。选好后点击“开始导入”即可。
        </div>
      </el-upload>

      <div class="upload-panel__selected" :class="{ 'is-empty': !hasFile }">
        <template v-if="hasFile">
          <div class="upload-panel__selected-title">{{ fileName }}</div>
          <div class="sf-inline-note">{{ fileSizeLabel }}</div>
        </template>
        <template v-else>
          <div class="upload-panel__selected-title">尚未选择文件</div>
          <div class="sf-inline-note">先确认账单来源，再选择对应文件。</div>
        </template>
      </div>

      <div class="upload-panel__actions">
        <el-button
          type="primary"
          :loading="uploading"
          :disabled="!hasFile"
          @click="emit('submit')"
        >
          开始导入
        </el-button>
        <el-button :icon="DocumentDelete" :disabled="!hasFile || uploading" @click="clearSelectedFile">
          重新选择
        </el-button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.upload-panel {
  display: grid;
  gap: 18px;
}

.upload-panel__form {
  display: grid;
  gap: 16px;
}

.upload-panel__label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.upload-panel__uploader :deep(.el-upload-dragger) {
  width: 100%;
  border-radius: 24px;
  border-style: dashed;
  border-color: rgba(23, 57, 89, 0.2);
  background: rgba(255, 255, 255, 0.48);
}

.upload-panel__icon {
  margin-bottom: 12px;
  font-size: 28px;
  color: var(--sf-accent);
}

.upload-panel__headline {
  font-size: 16px;
  font-weight: 700;
  color: var(--sf-primary);
}

.upload-panel__tip {
  max-width: 440px;
  margin: 8px auto 0;
  color: var(--sf-text-muted);
  line-height: 1.7;
}

.upload-panel__selected {
  padding: 16px 18px;
  border: 1px dashed rgba(21, 35, 58, 0.14);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.42);
}

.upload-panel__selected.is-empty {
  color: var(--sf-text-muted);
}

.upload-panel__selected-title {
  font-size: 15px;
  font-weight: 700;
}

.upload-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
}

@media (max-width: 720px) {
  .upload-panel__actions {
    justify-content: stretch;
  }

  .upload-panel__actions :deep(.el-button) {
    flex: 1 1 0;
  }
}
</style>
