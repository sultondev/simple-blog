<script lang="ts" setup>
import { useApi } from "~/composables/useApi";
import type {
  CommentDataType,
  PostDataType,
} from "~/typing";

const { $get } = useApi();
const currentPage = ref(1);
const limitPage = ref(10);
const comments = ref<CommentDataType[]>([]);
const post = ref<PostDataType>({});
const route = useRoute();

// When accessing /posts/1, route.params.id will be 1
onMounted(async () => {
  const data = await $get<CommentDataType[]>(
    `/posts/${route.params.id}/comments`,
    {
      params: {
        _page: currentPage.value,
        _limit: limitPage.value,
      },
    },
  );
  const postSingle = await $get<PostDataType>(
    `/posts/${route.params.id}`,
  );
  post.value = postSingle;
  comments.value = [...data];
});
</script>

<template>
  <div class="">
    <div
      class="py-3 px-4 rounded-xl flex justify-between gap-4 mb-8"
    >
      <div class="">
        <div
          class="font-bold block text-2xl mb-8 underline"
        >
          {{ post.title }}
        </div>
        <p class="">{{ post.body }}</p>
      </div>
    </div>

    <ul class="flex flex-col gap-6">
      <li
        v-for="(item, idx) in comments"
        :key="item.email + item.id + idx"
        class=""
      >
        <CommentItem
          :body="item.body"
          :email="item.email"
          :name="item.name"
        />
      </li>
    </ul>
  </div>
</template>
