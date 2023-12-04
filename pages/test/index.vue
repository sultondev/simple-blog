<script lang="ts" setup>
import { useCustomFetch } from "#imports";

const { data } = await useCustomFetch<object>("/posts");
console.log(data.value);
</script>

<template>
  <div class="">test</div>
</template>