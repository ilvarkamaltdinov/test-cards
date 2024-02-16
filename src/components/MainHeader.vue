<template>
  <header class="header">
    <h1 class="heading heading--h1">
      <slot name="title"></slot>
    </h1>
    <div class="header__controls">
      <div class="header__controls-group">
        <slot name="left-controls"></slot>
      </div>
      <div class="header__controls-group">
        <slot name="right-controls"></slot>
      </div>
    </div>
  </header>
</template>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}


.header__controls {
  display: flex;
  gap: 8px;
}

.header__controls-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header__controls-group-label {
  color: #71747C;
  font-size: 12px;
}
</style>