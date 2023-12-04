<script lang="ts" setup>
type PropTypes = {
  title: string;
  body: string;
  userId: number;
};

const props = defineProps<PropTypes>();
</script>

<template>
  <div
    class="shadow-md hover:shadow-lg py-3 px-4 rounded-xl"
  >
    <!--    <div>author informations</div>-->
    <div class="">{{ props.title }}</div>
    <p class="">{{ props.body }}</p>
    <!--    <div class="">post informations</div>-->
  </div>
</template>
