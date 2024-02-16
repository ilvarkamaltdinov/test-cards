<template>
  <article class="card">
    <div class="card__header">
      <div class="card__header-group">
        <h3 class="heading heading--h3">
          <slot name="title"></slot>
        </h3>
        <div class="card__header-controls">
          <slot name="controls"></slot>
        </div>
      </div>
      <slot name="drag"></slot>
    </div>
    <div class="card__body">
      <slot name="body">

      </slot>
    </div>
    <div class="card__footer">
      <slot name="footer">

      </slot>
    </div>
  </article>
</template>

<script setup>

</script>
<style lang="scss">

.card {
  width: 100%;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}

.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card__header-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card__header-controls {
  display: flex;
  align-items: center;
  gap: 1px;
}

.card__body {
  margin-top: 8px;
  font-size: 12px;
  color: #71747C;
}

.card__body-line {
  display: flex;
  gap: 4px;
}

.card__body-line-value {
  font-weight: 600;
  color: #38393D;
}
.card__footer{
  margin-top: auto;
}
</style>