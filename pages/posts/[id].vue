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
// When accessing /posts/1, route.params.id will be 1
onMounted(async () => {
  dataLoadings.commentsInitialLoading = true;
  await $get<CommentDataType[]>(
    `/posts/${route.params.id}/comments`,
    {
      params: {
        _page: currentPage.value,
        _limit: dataLimit.value,
      },
    },
  ).then((data) => {
    comments.value = data;
    dataLoadings.commentsInitialLoading = false;
  });

  dataLoadings.postInitialLoading = true;
  await $get<PostDataType>(
    `/posts/${route.params.id}`,
  ).then((data) => {
    post.value = data;
    dataLoadings.postInitialLoading = false;
  });

  window.addEventListener("scroll", onScroll);
});

function onScroll() {
  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 10;
  if (nearBottom) {
    loadMore();
  }
}

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

async function loadMore() {
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