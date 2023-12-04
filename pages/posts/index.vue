<script lang="ts" setup>
import { reactive } from "vue";
import { useCustomFetch } from "#imports";

const pageData = reactive({
  currentPage: 1,
  limit: 10,
});

const { data, refresh } = useCustomFetch<
  {
    body: string;
    title: string;
    userId: number;
    id: number;
  }[]
>("/posts", {
  query: {
    _page: pageData.currentPage,
    _limit: pageData.limit,
  },
});

async function handleLoad() {
  pageData.currentPage + 1;
  await refresh();
}
</script>

<template>
  <div class="">
    <ul class="py-6 flex flex-col gap-4">
      <li v-for="(item, idx) in data" :key="item.id">
        <PostItem
          :body="item.body"
          :title="item.title"
          :user-id="item.userId"
        />
      </li>
    </ul>
    <button @click="handleLoad">next page</button>
  </div>
</template>