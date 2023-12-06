<script lang="ts" setup>
import type { PostDataType, UserDataType } from "~/typing";
import { useApi } from "~/composables/useApi";
import { debounce } from "~/utils/debounce";

const currentPage = ref(1);
const dataLimit = ref(10);

const posts = ref<PostDataType[]>([]);

const postFilters = reactive({
  title: "",
  order: "asc",
  author: "",
  sort: [],
});
const liveSearch = ref(false);
const debounceSearchText = ref("");
const { $get } = useApi<PostDataType[]>();
const users = ref<UserDataType[]>([]);
const dataLoadings = reactive({
  postInialLoading: false,
  scrollLoading: false,
  filterLoading: false,
});
const runOutData = ref(false);

onMounted(async () => {
  dataLoadings.postInialLoading = true;
  await $get("/posts", {
    params: {
      _page: currentPage.value,
      _limit: dataLimit.value,
      _order: postFilters.order,
    },
  }).then((data) => {
    posts.value = data;
    dataLoadings.postInialLoading = false;
  });
  await $get<UserDataType[]>("/users").then((data) => {
    users.value = data;
  });
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

function onScroll() {
  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 10;
  if (
    nearBottom &&
    !dataLoadings.filterLoading &&
    !runOutData.value &&
    !dataLoadings.scrollLoading
  ) {
    loadMore();
  }
}

async function loadMore() {
  try {
    currentPage.value++;
    dataLoadings.scrollLoading = true;
    const response = await $get("/posts", {
      params: {
        _page: currentPage.value,
        _limit: dataLimit.value,
        _sort: postFilters.sort.join(","),
        _order: postFilters.order,
        title_like: postFilters.title,
      },
    });
    posts.value = [...posts.value, ...response];

    dataLoadings.scrollLoading = false;
    if (response.length === 0) runOutData.value = true;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
  }
}

const debouncedSearch = debounce((query: string) => {
  postFilters.title = query;
}, 500);

function onSubmit(e: Event) {
  e.preventDefault();
  fetchPostsWithFilter();
}

function handleTitleSearch(event: Event) {
  const input = event.target as HTMLInputElement;
  debounceSearchText.value = input.value;
}

async function fetchPostsWithFilter() {
  currentPage.value = 1;
  dataLoadings.filterLoading = true;
  runOutData.value = false;
  await $get("/posts", {
    params: {
      _limit: dataLimit.value,
      _sort: postFilters.sort.join(","),
      _order: postFilters.order,
      title_like: postFilters.title,
      name: postFilters.author,
    },
  })
    .then((data) => {
      posts.value = data;
    })
    .finally(() => {
      dataLoadings.filterLoading = false;
    });
}

watch(postFilters, () => {
  if (liveSearch.value) {
    fetchPostsWithFilter();
  }
});

watch(debounceSearchText, (newValue) => {
  debouncedSearch(newValue);
});
</script>

<template>
  <div class="flex justify-between gap-10 py-8">
    <div class="">
      <div class="text-4xl font-bold mb-8">Posts</div>
      <div v-if="dataLoadings.postInialLoading">
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
        <div class="py-8">loading skeleton</div>
      </div>
      <div
        v-else-if="dataLoadings.filterLoading"
        class="min-h-50"
      >
        <div class="text-8xl">Loading...</div>
      </div>
      <div v-else-if="posts.length === 0" class="">
        Empty
      </div>
      <ul v-else class="py-6 flex flex-col gap-4">
        <li
          v-for="item in posts"
          :key="item.id + item.userId"
        >
          <PostItem
            :id="item.id"
            :body="item.body"
            :title="item.title"
            :user-id="item.userId"
          />
        </li>
      </ul>
      <div
        v-if="
          dataLoadings.scrollLoading && posts.length > 0
        "
      >
        infinity scroll loading...
      </div>
      <!-- Для infinity scroll-a -->
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
          <!-- Не использовал v-mode потому что при фокусе на пустое поле watch отрабатывает как в @change  -->
          <input
            :value="debounceSearchText"
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
              v-model="postFilters.author"
              class="w-full py-1 border"
              name="author"
            >
              <option value="">None</option>
              <option
                v-for="(user, idx) in users"
                :key="user.email + idx"
                :value="user.username"
              >
                <div class="flex justify-between">
                  <div>{{ user.id }} )</div>
                  <div class="mr-4 block">
                    {{ user.name }}
                  </div>
                </div>
              </option>
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
