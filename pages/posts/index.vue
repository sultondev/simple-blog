<script lang="ts" setup>
import type { PostDataType } from "~/typing/PostData";
import { useApi } from "~/composables/useApi";
import { useIntersectionObserver } from "~/composables/useIntersectionObserver";

const currentPage = ref(1);
const dataLimit = ref(10);

const posts = ref<PostDataType[]>([]);

const postFilters = reactive({
  title: "",
  order: "",
  author: "",
  sort: [],
});
const liveSearch = ref(false);

const shouldIntersecting = ref(true);
const { loading, $get } = useApi<PostDataType[]>();

onMounted(async () => {
  const data = await $get("/posts", {
    params: {
      _page: currentPage.value,
      _limit: dataLimit.value,
    },
  });

  posts.value = [...data];
});

async function loadMore() {
  currentPage.value = currentPage.value + 1;
  const data = await $get("/posts", {
    params: {
      _page: currentPage.value,
      _limit: dataLimit.value,
    },
  });

  posts.value = [...posts.value, ...data];
}

const observerElement = ref(null);
const loadMoreCallback: IntersectionObserverCallback = (
  entries,
) => {
  const [entry] = entries;
  if (entry.isIntersecting) {
    loadMore();
  }
};

useIntersectionObserver(observerElement, loadMoreCallback);

async function onSubmit(e: Event) {
  e.preventDefault();
  fetchPostsWithFilter();
}

function handleTitleSearch(e: Event): void {
  const input = e.target as HTMLInputElement;
  postFilters.title = input.value;
}

async function fetchPostsWithFilter() {
  await $get("/posts", {
    params: {
      _limit: dataLimit.value,
      _sort: postFilters.sort.join(","),
      _order: postFilters.order,
      title_like: postFilters.title,
    },
  }).then((res) => {
    posts.value = [...res];
  });
}

watch(postFilters, () => {
  if (liveSearch) {
    setTimeout(() => {
      fetchPostsWithFilter();
    }, 1000);
  }
});
</script>

<template>
  <div class="flex justify-between gap-10 py-8">
    <div class="">
      <div class="text-4xl font-bold mb-8">Posts</div>
      <div v-if="loading && posts.length === 0">
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
      </div>
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
      <div v-if="loading && posts.length > 0">
        infinity scroll loading...
      </div>
      <!-- Для infinity scroll-a -->
      <div ref="observerElement"></div>
    </div>
    <div class="">
      <aside
        class="py-7 sticky top-2 px-6 rounded-md shadow-md min-w-[360px]"
      >
        <form
          class="flex flex-col gap-4"
          @submit="onSubmit"
        >
          <div class="text-2xl font-medium mb-6">
            Filters
          </div>
          <input
            :value="postFilters.title"
            class="border py-1 px-2 w-full outline-none focus:border-black rounded"
            name="titleSearch"
            placeholder="Search by title"
            type="text"
            @input="handleTitleSearch"
          />
          <div class="flex items-center justify-between">
            <label
              class="flex items-center gap-2"
              for="asc"
            >
              <input
                id="asc"
                v-model="postFilters.order"
                checked
                class="block py-2"
                name="order"
                type="radio"
                value="asc"
              />
              <span class=""> ascending </span>
            </label>
            <label
              class="flex items-center gap-2"
              for="desc"
            >
              <input
                id="desc"
                v-model="postFilters.order"
                class="block py-2"
                name="order"
                type="radio"
                value="desc"
              />
              <span class=""> descending </span>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <label
              class="flex items-center gap-2"
              for="by-views"
            >
              <input
                id="by-views"
                v-model="postFilters.sort"
                class="block py-2"
                name="sort"
                type="checkbox"
                value="views"
              />
              <span class=""> views </span>
            </label>
            <label
              class="flex items-center gap-2"
              for="by-comments"
            >
              <input
                id="by-comments"
                v-model="postFilters.sort"
                class="block py-2"
                name="sort"
                type="checkbox"
                value="comments"
              />
              <span class=""> comments </span>
            </label>
          </div>

          <div class="">
            <select
              id=""
              class="w-full py-1 border"
              name="author"
            >
              <option value="1">1</option>
            </select>
          </div>
          <button
            :disabled="liveSearch"
            class="search-button"
            type="submit"
          >
            Search
          </button>
          <label for="live-search">
            <input
              id="live-search"
              v-model="liveSearch"
              type="checkbox"
            />
            <span class=""> Live Search </span>
          </label>
        </form>
      </aside>
    </div>
  </div>
</template>

<style>
.search-button {
  @apply transition-all duration-500 bg-gray-200 py-1 rounded;
  @apply disabled:text-gray-400 enabled:hover:bg-gradient-to-r;
  @apply enabled:hover:from-light-green enabled:hover:to-dark-green enabled:hover:text-white;
}
</style>