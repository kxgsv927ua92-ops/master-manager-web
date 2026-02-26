import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref, computed } from 'vue';
import { ImClientVO } from '@/api/master/imClient/types';

export const useImClientStore = defineStore('imClient', () => {
  // 选中的平台ID
  const selectedClientId = useStorage<string | number | null>('selectedClientId', null);

  // 平台列表
  const imClientList = ref<ImClientVO[]>([]);

  // 当前选中的平台
  const currentClient = computed(() => {
    if (!selectedClientId.value) return null;
    return imClientList.value.find(item => item.id === selectedClientId.value) || null;
  });

  // 当前平台的统计页面 URL
  const currentClientUrl = computed(() => {
    return currentClient.value?.clientApiUrl || '';
  });

  // 设置平台列表
  const setImClientList = (list: ImClientVO[]) => {
    imClientList.value = list;
  };

  // 设置选中的平台
  const setSelectedClientId = (id: string | number | null) => {
    selectedClientId.value = id;
  };

  return {
    selectedClientId,
    imClientList,
    currentClient,
    currentClientUrl,
    setImClientList,
    setSelectedClientId
  };
});
