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