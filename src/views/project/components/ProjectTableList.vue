<template>
  <n-data-table :columns="columns" :data="data" striped />
</template>

<script setup lang="ts">
import { h } from 'vue'
import { ProjectType } from '@/interface'
import { DataTableColumns, NButton, NIcon, NImage } from 'naive-ui'
import { StarOutline, StarSharp } from '@vicons/ionicons5'
import { formatDate } from '@/utils'

const props = defineProps<{
  data: Array<ProjectType>
}>()
const emit = defineEmits(['updateProject', 'deleteProject', 'clickProject', 'toggleStar'])

const columns: DataTableColumns<ProjectType> = [
  {
    title: '项目封面',
    key: 'name',
    align: 'center',
    render(row) {
      return h(NImage, {
        width: '50',
        src: row.cover
      })
    }
  },
  {
    title: '项目名称',
    key: 'name',
    align: 'center'
  },
  {
    title: '是否标星',
    key: 'type',
    align: 'center',
    render(row) {
      return h(NIcon, {
        component: row.star ? StarSharp : StarOutline,
        color: row.star ? '#efe80eff' : '#999',
        onClick: () => {
          emit('toggleStar', row)
        }
      })
    }
  },
  {
    title: '创建时间',
    key: 'createDate',
    align: 'center',
    render(row) {
      return h('span', null, { default: () => formatDate(row.createDate) })
    }
  },
  {
    title: '操作',
    align: 'center',
    key: 'actions',
    render(row) {
      return [
        h(
          NButton,
          {
            quaternary: true,
            size: 'small',
            type: 'primary',
            onClick: () => {
              emit('clickProject', row)
            }
          },
          { default: () => '详情' }
        ),
        h(
          NButton,
          {
            quaternary: true,
            size: 'small',
            type: 'info',
            onClick: () => {
              emit('updateProject', row)
            }
          },
          { default: () => '编辑' }
        ),
        h(
          NButton,
          {
            quaternary: true,
            size: 'small',
            type: 'error',
            onClick: () => {
              emit('deleteProject', row)
            }
          },
          { default: () => '删除' }
        )
      ]
    }
  }
]
</script>

<style lang="scss" scoped></style>
