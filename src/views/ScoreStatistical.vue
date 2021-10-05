<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <v-chart class="chart" style="width: 600px;height:400px;" :option="option"></v-chart>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import { use } from "echarts/core";
  import { GridComponent } from 'echarts/components';
  import { BarChart } from 'echarts/charts';
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
  } from "echarts/components";
  import VChart, { THEME_KEY } from "vue-echarts";
  import { ref, defineComponent } from "vue";

  use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    BarChart
  ]);

  export default  defineComponent({
    name: "ScoreStatistical",
    components: {
      VChart
    },
    setup: () => {
      const option = ref({
            title: {
              text: '学生成绩统计'
            },
            tooltip: {},
            legend: {
              data:['销量']
            },
            xAxis: {
              data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }],

        })
      return { option };
     },
    data(){
      return{
        color:'d',
      }
    },
    methods:{
    }
  })
</script>

<style scoped>

</style>
