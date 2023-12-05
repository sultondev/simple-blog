<script lang="ts" setup>
import { useAsyncData } from "#app";
import type { PostDataType } from "~/typing/PostData";
import { useCustomFetch } from "~/composables/useCustomFetch";

const currentPage = ref(1);
const dataLimit = ref(10);
const dataOrder = ref<"asc" | "desc">("asc");

const posts = ref<PostDataType[] | []>([]);
const { data, pending, error } = useAsyncData<
  PostDataType[]
>(
  "postsReqs",
  () =>
    useCustomFetch("/posts", {
      params: {
        _page: currentPage.value,
        _limit: dataLimit.value,
      },
    }),
  {
    watch: [dataLimit, currentPage],
  },
);

watch(data, () => {
  posts.value = [
    ...posts.value,
    ...(data.value as PostDataType[] | []),
  ];
});

// дата дольжна было хранить в себе total,

function loadMore() {
  currentPage.value = currentPage.value + 1;
}

// function filterBySettings() {
//   const filteredPosts = $fetch(`/posts`, {
//     method: "GET",
//     baseURL: "https://jsonplaceholder.typicode.com",
//     params: {
//       _order: dataOrder.value,
//     },
//   });
// }
//
// filterBySettings();

let observer: IntersectionObserver | null = null;
const observerElement = ref(null);

const observerCallback: IntersectionObserverCallback = (
  entries,
) => {
  const [entry] = entries;

  if (entry.isIntersecting) {
    loadMore();
  }
};

onMounted(() => {
  observer = new IntersectionObserver(observerCallback, {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  });

  if (observerElement.value) {
    observer.observe(observerElement.value);
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div class="">
    <select v-model="dataOrder" name="order">
      <option value="asc">A-Z</option>
      <option value="desc">Z-A</option>
    </select>
    <div v-if="pending && posts.length === 0">
      loading logic...
    </div>
    <div v-else-if="error">error logic</div>
    <ul v-else class="py-6 flex flex-col gap-4">
      <li
        v-for="(item, idx) in posts"
        :key="'postItem-' + item.id + idx"
      >
        <PostItem
          :id="item.id"
          :body="item.body"
          :title="item.title"
          :user-id="item.userId"
        />
      </li>
    </ul>
    <div v-if="pending && posts.length > 0">
      loading logic...
    </div>
    <!-- Element to observe -->
    <div ref="observerElement"></div>
  </div>
</template>
