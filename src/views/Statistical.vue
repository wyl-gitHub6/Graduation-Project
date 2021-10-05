<template>
        <v-chart class="chart" :option="option" />
</template>

<script>
  import { use } from "echarts/core";
  import { CanvasRenderer } from "echarts/renderers";
  import { PieChart } from "echarts/charts";
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
  } from "echarts/components";
  import VChart, { THEME_KEY } from "vue-echarts";
  import { ref, defineComponent } from "vue";

  use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent
  ]);

  export default  defineComponent({
    name: "Statistical",
    components: {
      VChart
    },
    provide: {
      [THEME_KEY]: "dark"
    },
    setup: () => {
      const option = ref({
        title: {
          text: "学生学课情况统计图",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["语文", "数学", "英语", "Video Ads", "Search Engines"]
        },
        series: [
          {
            name: "学生学课情况",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "语文" },
              { value: 310, name: "数学" },
              { value: 234, name: "英语" },
              { value: 135, name: "Video Ads" },
              { value: 1548, name: "Search Engines" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });

      return { option };
    }
  })
</script>

<style scoped>

</style>
