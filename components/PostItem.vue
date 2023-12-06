<script lang="ts" setup>
type PropTypes = {
  title: string;
  body: string;
  userId: number;
  id: number;
};

const props = defineProps<PropTypes>();
</script>

<template>
  <div
    class="shadow-md hover:shadow-lg py-3 px-4 rounded-xl flex justify-between gap-4"
  >
    <div class="">
      <NuxtLink
        v-once
        :to="'/posts/' + props.id"
        class="font-bold block text-2xl mb-8 underline"
      >
        {{ props.title }}
      </NuxtLink>
      <p v-once class="">{{ props.body }}</p>
    </div>
    <div>
      <img
        v-once
        alt="not-found"
        class="min-w-[150px] min-h-[150px]"
        src="../public/images/empty-img.png"
      />
    </div>
  </div>
</template>
