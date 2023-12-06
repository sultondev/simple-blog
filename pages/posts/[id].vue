<script lang="ts" setup>
import { useApi } from "~/composables/useApi";

type commentDataType = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

const { $get } = useApi();
const currentPage = ref(1);
const limitPage = ref(10);
const comments = ref<commentDataType[]>([]);

onMounted(async () => {
  const data = await $get<commentDataType[]>("/comments", {
    params: {
      _page: currentPage.value,
      _limit: limitPage.value,
    },
  });

  comments.value = [...data];
});
</script>

<template>
  <div class="">
    single

    <div>
      <div
        v-for="(item, idx) in comments"
        :key="item.email + item.id + idx"
        class=""
      >
        <div class="">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>
