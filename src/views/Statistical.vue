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
  import request from "../utils/request";

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
          text: "学生选课情况统计图",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: []
        },
        series: [
          {
            name: "学生学课情况",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
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
    },
    methods:{
       load(){
          request.get('/api/score/statistical').then(res=>{
              for (let i = 0;i<res.data.length;i++){
                 this.option.legend.data[i] = res.data[i].course.name
                 this.option.series[0].data[i] =  res.data[i].course
              }
          })
       },

    },
    created() {
       this.load()
    }
  })
</script>

<style scoped>

</style>
