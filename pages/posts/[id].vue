<script lang="ts" setup>
import { useApi } from "~/composables/useApi";

import type {
  CommentDataType,
  PostDataType,
} from "~/typing";

const { $get } = useApi();
const currentPage = ref(1);
const dataLimit = ref(10);
const comments = ref<CommentDataType[]>([]);
const post = ref<PostDataType>({});
const route = useRoute();
const dataLoadings = reactive({
  postInitialLoading: false,
  commentsInitialLoading: false,
  scrollLoading: false,
});
const runOutData = ref(false);

// When accessing /posts/1, route.params.id will be 1
onMounted(async () => {
  try {
    dataLoadings.commentsInitialLoading = true;
    const [commentsRequest, postInfoRequest] =
      await Promise.all([
        $get<CommentDataType[]>(
          `/posts/${route.params.id}/comments`,
          {
            params: {
              _page: currentPage.value,
              _limit: dataLimit.value,
            },
          },
        ),
        $get<PostDataType>(`/posts/${route.params.id}`),
      ]);
    post.value = postInfoRequest;
    dataLoadings.postInitialLoading = false;

    comments.value = commentsRequest;
    dataLoadings.commentsInitialLoading = false;
  } catch (error) {
    // handle errors here
  }

  window.addEventListener("scroll", onScroll);
});

function onScroll() {
  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 2;
  if (nearBottom && !dataLoadings.scrollLoading) {
    loadMore();
  }
}

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

async function loadMore() {
  if (runOutData.value) return;
  try {
    currentPage.value++;
    dataLoadings.scrollLoading = true;

    const response = await $get(
      `/posts/${route.params.id}/comments`,
      {
        params: {
          _page: currentPage.value,
          _limit: dataLimit.value,
        },
      },
    );
    comments.value = [...comments.value, ...response];
    dataLoadings.scrollLoading = false;
    runOutData.value = response.length === 0;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
  }
}
</script>

<template>
  <div class="">
    <div
      class="py-3 px-4 rounded-xl flex justify-between gap-4 mb-8"
    >
      <div
        v-if="dataLoadings.postInialLoading"
        class="text-3xl"
      >
        Loading..
      </div>
      <div v-else class="">
        <div
          class="font-bold block text-2xl mb-8 underline"
        >
          {{ post.title }}
        </div>
        <p class="">{{ post.body }}</p>
      </div>
    </div>
    <div v-if="dataLoadings.commentsInitialLoading">
      <div class="py-8">loading skeleton</div>
      <div class="py-8">loading skeleton</div>
      <div class="py-8">loading skeleton</div>
      <div class="py-8">loading skeleton</div>
      <div class="py-8">loading skeleton</div>
      <div class="py-8">loading skeleton</div>
    </div>
    <div
      v-else-if="
        comments.length === 0 && !dataLoadings.scrollLoading
      "
    >
      Empty
    </div>
    <ul v-else class="flex flex-col gap-6">
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
    <div v-if="dataLoadings.scrollLoading" class="text-3xl">
      Scroll loading
    </div>
  </div>
</template>