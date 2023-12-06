<script lang="ts" setup>
type PropTypes = {
  name: string;
  body: string;
  email: string;
};

const props = defineProps<PropTypes>();
</script>

<template>
  <div class="shadow-md py-4 px-6 rounded">
    <div class="">
      <div class="">
        {{ props.name }}
      </div>
    </div>
    <div class="">
      {{ props.email }}
    </div>
    <div class="">
      {{ props.body }}
    </div>
  </div>
</template>
