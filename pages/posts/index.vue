<script lang="ts" setup>
import { reactive } from "vue";
import { useAsyncData } from "#app";
import { $fetch } from "ofetch";

const pageData = reactive({
  currentPage: 1,
  limit: 10,
});
const currentPage = ref(1);
const dataLimit = ref(10);
const dataOrder = ref<"asc" | "desc">("asc");

const { data } = useAsyncData(
  "postsReqs",
  () =>
    $fetch(`/posts`, {
      method: "GET",
      baseURL: "https://jsonplaceholder.typicode.com",
      params: {
        // _page: currentPage.value,
        _limit: dataLimit.value,
        _order: dataOrder.value,
      },
    }),
  {
    watch: [dataLimit, dataOrder],
  },
);

function loadMore() {
  currentPage.value += 1;
}

let observer: IntersectionObserver | null = null;
const observerElement = ref(null);

const observerCallback: IntersectionObserverCallback = (
  entries,
  observer,
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
    <ul class="py-6 flex flex-col gap-4">
      <li
        v-for="(item, idx) in data"
        :key="'postItem-' + item.id"
      >
        <PostItem
          :id="item.id"
          :body="item.body"
          :title="item.title"
          :user-id="item.userId"
        />
      </li>
    </ul>
    <!-- Element to observe -->
    <div ref="observerElement"></div>
  </div>
</template>