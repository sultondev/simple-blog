<script lang="ts" setup>
import type { PostDataType, UserDataType } from "~/typing";
import { useApi } from "~/composables/useApi";
import { useIntersectionObserver } from "~/composables/useIntersectionObserver";
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
const { loading, $get } = useApi<PostDataType[]>();
const users = ref<UserDataType[]>([]);
onMounted(async () => {
  const data = await $get("/posts", {
    params: {
      _page: currentPage.value,
      _limit: dataLimit.value,
      _order: postFilters.order,
    },
  });
  const usersList = await $get<UserDataType[]>("/users");
  users.value = usersList;
  posts.value = data;
});

async function loadMore() {
  currentPage.value = currentPage.value + 1;
  const data = await $get("/posts", {
    params: {
      _page: currentPage.value,
      _limit: dataLimit.value,
      _sort: postFilters.sort.join(","),
      _order: postFilters.order,
      title_like: postFilters.title,
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
    // need to write debounce logic instead of this garbage
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
      <div v-else-if="!loading && posts.length === 0">
        empty
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
              id=""
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
