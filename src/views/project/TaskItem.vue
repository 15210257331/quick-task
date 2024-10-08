<template>
  <n-card hoverable :content-style="{ padding: '10px 15px' }" class="task-item" @click="taskDetail">
    <!-- <div class="border-line" :style="{ backgroundColor: borderColor }"></div> -->
    <div class="tag">
      <n-space>
        <n-tooltip trigger="hover">
          {{ '任务优先级：' + priority?.label }}
          <template #trigger>
            <n-tag :type="priority?.type" :bordered="false" size="small">
              {{ priority?.label }}
              <template #icon>
                <n-icon :component="FlagSharp" />
              </template>
            </n-tag>
          </template>
        </n-tooltip>
        <n-tag v-for="item in props.task.tags" :key="item.id" type="warning" :bordered="false" size="small">
          {{ item.name }}
        </n-tag>
      </n-space>
      <n-dropdown trigger="hover" :options="options" @select="handleSelect">
        <n-icon size="20" :component="EllipsisHorizontal" />
      </n-dropdown>
    </div>
    <div class="title">
      <p :class="{ complete: complete }">{{ task.name }}</p>
    </div>
    <div class="description">
      <p :class="{ complete: complete }">{{ task.description }}</p>
    </div>
    <div class="time">
      <n-icon size="15" color="#888" :component="Calendar" />
      <span>{{ startDate }} - {{ endDate }}</span>
    </div>
    <div class="progress">
      <div>
        <span>任务进度:</span>
        <span>{{ progress }}%</span>
      </div>
      <n-progress type="line" :color="progressColor" :height="6" status="info" :percentage="progress" :show-indicator="false" />
    </div>
    <div class="tag">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-avatar round size="small" :src="owner.avatar" />
        </template>
        <span>{{ owner.nickname }}</span>
      </n-tooltip>
      <n-space>
        <TaskTag
          v-if="remind && !complete"
          type="success"
          name="提醒"
          :icon="Alarm"
          :tooltip-content="'已添加任务提醒：' + remind"
        />
        <TaskTag
          v-if="expiration && !complete"
          type="error"
          name="已过期"
          :icon="TimeSharp"
          tooltip-content="该任务已经延期"
        />
        <TaskTag
          v-if="complete"
          type="success"
          :name="'已完成'"
          :icon="TimeSharp"
          :tooltip-content="'该任务标记为已完成'"
        />
      </n-space>
    </div>

    <!-- 任务详情modal -->
    <TaskDetailModal v-model:value="showTaskDetailModal" :task="task" :complete="complete" />

    <!-- 设置提醒 -->
    <n-modal v-model:show="showAlarmModal">
      <n-card
        :segmented="{
          content: true,
          footer: true
        }"
        style="width: 520px"
        :title="'设置任务提醒'"
        :bordered="false"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button quaternary circle>
            <template #icon>
              <n-icon size="20" @click="showAlarmModal = false">
                <Close />
              </n-icon>
            </template>
          </n-button>
        </template>
        <div>
          <n-radio-group v-model:value="alarm" name="radiogroup">
            <n-space>
              <n-radio v-for="item in remindOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </div>
        <template #footer>
          <n-space horizontal style="float: right">
            <n-button tertiary @click="showAlarmModal = false"> 取消 </n-button>
            <n-button type="primary" @click="setAlarm"> 确认 </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectStore } from '@/store'
import { TaskType } from '@/interface'
import {
  EllipsisHorizontal,
  CheckmarkCircle,
  Close,
  Copy,
  TrashBin,
  Alarm,
  ShareSocialSharp,
  AlertCircle,
  TimeSharp,
  Calendar,
  FlagSharp
} from '@vicons/ionicons5'
import { useRender } from '@/hooks'
import TaskDetailModal from './TaskDetailModal.vue'
import TaskTag from '@/components/TaskTag.vue'
import dayjs from 'dayjs'
import { useMessage } from 'naive-ui'
import { progressColors, leftBorderColors, priorityOptions, remindOptions } from '@/constant'
import { formatDate } from '@/utils'

const props = defineProps<{
  task: TaskType
  complete: boolean
  flowId: string
}>()
const { renderIcon } = useRender()
const message = useMessage()
const projectStore = useProjectStore()
const showTaskDetailModal = ref<boolean>(false)
const showAlarmModal = ref<boolean>(false)
const alarm = ref<number>(props.task.remind)
const options = ref([
  {
    label: '复制任务',
    key: 'copy',
    icon: renderIcon(Copy)
  },
  {
    label: '关联内容',
    key: 'link',
    icon: renderIcon(ShareSocialSharp),
    disabled: props.complete
  },
  {
    label: '设置任务提醒',
    key: 'alarm',
    icon: renderIcon(Alarm),
    disabled: props.complete
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    label: '移到回收站',
    key: 'trash',
    icon: renderIcon(TrashBin)
  }
])
const startDate = computed(() => {
  return formatDate(props.task.startDate, 'MM月DD日')
})

const endDate = computed(() => {
  return formatDate(props.task.endDate, 'MM月DD日')
})

const progress = computed(() => {
  return props.task.progress
})

const progressColor = computed(() => {
  const progress = props.task.progress
  if (progress <= 10) {
    return progressColors[0]
  } else if (progress > 10 && progress <= 40) {
    return progressColors[1]
  } else if (progress > 40 && progress <= 60) {
    return progressColors[2]
  } else if (progress > 60 && progress <= 80) {
    return progressColors[3]
  } else if (progress > 80 && progress <= 90) {
    return progressColors[4]
  } else if (progress > 90 && progress <= 100) {
    return progressColors[5]
  }
  return progressColors[5]
})

const borderColor = computed(() => {
  return leftBorderColors[Number(props.task.priority) - 1]
})

const owner = computed(() => {
  return props.task.owner || {}
})

/**任务优先级 */
const priority = computed(() => {
  return priorityOptions.find(item => item.value === props.task.priority)
})

const remind = computed(() => {
  if (props.task.remind === 0) {
    return false
  }
  return remindOptions.filter(item => item.value === props.task.remind)[0].label
})

const expiration = computed(() => {
  return dayjs().isAfter(dayjs(props.task.endDate)) && !props.task.computed
})

function taskDetail() {
  showTaskDetailModal.value = true
}

async function handleSelect(key: string | number) {
  if (key === 'next') {
    const index = projectStore.currentProject?.groups.findIndex(item => item.id === props.flowId)
    let newFlowId
    // if (index && index < projectStore.currentProject?.groups.length - 1) {
    //   newFlowId = projectStore.selectedProjectGroups[index + 1].id
    // }
    await projectStore.updateTaskProps(props.task.id, 'flow', newFlowId)
  } else if (key === 'copy') {
    message.info('任务已复制')
  } else if (key === 'alarm') {
    showAlarmModal.value = true
  } else if (key === 'trash') {
    await projectStore.deleteTask(props.task.id)
  }
}

async function setAlarm() {
  await projectStore.updateTaskProps(props.task.id, 'remind', alarm.value)
  message.success('操作成功')
  showAlarmModal.value = false
}
</script>

<style lang="scss" scoped>
.task-item {
  cursor: pointer;
  margin-bottom: 10px;
  min-height: 70px;
  position: relative;

  &:hover {
    box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.15);
    .border-line {
      width: 6px !important;
    }
  }

  .border-line {
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    width: 4px;
    background-color: red;
    transition: all 0.2s;
  }

  .title {
    display: flex;
    margin-top: 8px;
    // align-items: center;
    p {
      flex: 1;
      line-height: 30px;
      font-weight: 600;
      white-space: normal;
      margin-right: 8px;
      font-size: 16px;
    }
  }

  .time {
    overflow: hidden;
    margin: 5px 0 10px 0;
    display: flex;
    align-items: center;
    span {
      font-size: 12px;
      font-weight: 400;
      margin: 0 5px;
      color: #888;
    }
  }
  .description {
    font-size: 12px;
    color: #888;
    font-weight: 400;
    margin-top: 6px;
    margin-bottom: 10px;
    p {
      white-space: normal;
    }
  }
  .progress {
    margin: 10px 0;
    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      span {
        font-size: 13px;
        color: #888;
        font-weight: 600;
        strong {
          margin-right: 5px;
        }
      }
    }
  }
  .tag {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .indicator {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.complete {
  text-decoration: line-through;
  color: #ccc;
}

::v-deep(.n-progress-content) {
  width: 100%;
}
</style>
