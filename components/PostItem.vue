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
    class="shadow-md hover:shadow-lg py-3 px-4 rounded-xl"
  >
    <!--    <div>author informations</div>-->
    <NuxtLink
      :to="'/posts/' + props.id"
      class="font-bold text-2xl mb-4"
    >
      {{ props.title }}
    </NuxtLink>
    <p class="">{{ props.body }}</p>
    <!--    <div class="">post informations</div>-->
  </div>
</template>
