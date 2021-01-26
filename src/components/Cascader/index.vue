<template>
  <div id="address">
    <div class="address-box"
         @click="showTabBox">
      <el-input :value="regions"
                type="text"
                size="mini"
                placeholder="请选择地区"></el-input>
      <i class="el-icon-caret-bottom"></i>
    </div>
    <div class="tab-wrap">
      <ul v-show="isShowTab"
          class="tab-list">
        <li v-for="items in tab"
            :key="items.value"
            :class="items.selected?'select tab':'tab'"
            @click="bindTap(items.value)">
          <a>{{items.name}}</a>
        </li>
      </ul>
      <div v-show="isShowCommon"
           class="tab-box">
        <a v-for="items in common"
           :key="items.name"
           @click="bindCommon(items.name)"
           class="city">{{items.name}}</a>
        <a @click="bindTap('province')">更多&gt;</a>
        <!-- <span class="forEnglish"
              v-if="enAdderFlag"
              @click="changeENAdder">这是一个外文地址&gt;</span> -->
      </div>
      <div v-show="isShowProvince"
           class="tab-box province-box">
        <dl>
          <dt>A-G</dt>
          <dd>
            <a v-for="items in province.A_G"
               :key="items.name"
               @click="bindProvince(items.name)">{{items.name}}</a>
          </dd>
          <dt>H-K</dt>
          <dd>
            <a v-for="items in province.H_K"
               :key="items.name"
               @click="bindProvince(items.name)">{{items.name}}</a>
          </dd>
          <dt>L-S</dt>
          <dd>
            <a v-for="items in province.L_S"
               :key="items.name"
               @click="bindProvince(items.name)">{{items.name}}</a>
          </dd>
          <dt>T-Z</dt>
          <dd>
            <a v-for="items in province.T_Z"
               :key="items.name"
               @click="bindProvince(items.name)">{{items.name}}</a>
          </dd>
        </dl>
      </div>
      <div v-show="isShowCity"
           class="tab-box city-box">
        <a v-for="items in city"
           :key="items.name"
           @click="bindCity(items.name)">{{items.name}}</a>
      </div>
      <div v-show="isShowCounty"
           class="tab-box county-box">
        <a v-for="items in county"
           :key="items.name"
           @click="bindCounty(items.name)">{{items.name}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import area from '@/utils/area';
export default {
  name: 'cascader',
  props: {
    regions: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tab: [
        {
          name: '常用',
          value: 'common',
          selected: true
        },
        {
          name: '省份',
          value: 'province',
          selected: false
        },
        {
          name: '城市',
          value: 'city',
          selected: false,
          disable: true
        },
        {
          name: '县区',
          value: 'county',
          selected: false,
          disable: true
        }
      ],
      common: [
        {
          name: '上海市'
        },
        {
          name: '深圳市'
        },
        {
          name: '北京市'
        },
        {
          name: '广州市'
        },
        {
          name: '苏州市'
        },
        {
          name: '成都市'
        },
        {
          name: '东莞市'
        },
        {
          name: '宁波市'
        },
        {
          name: '天津市'
        },
        {
          name: '杭州市'
        },
        {
          name: '青岛市'
        },
        {
          name: '重庆市'
        },
        {
          name: '武汉市'
        },
        {
          name: '郑州市'
        }
      ],
      province: {
        A_G: [
          {
            name: '安徽'
          },
          {
            name: '澳门'
          },
          {
            name: '北京'
          },
          {
            name: '重庆'
          },
          {
            name: '福建'
          },
          {
            name: '甘肃'
          },
          {
            name: '广东'
          },
          {
            name: '广西'
          },
          {
            name: '贵州'
          }
        ],
        H_K: [
          {
            name: '海南'
          },
          {
            name: '河北'
          },
          {
            name: '河南'
          },
          {
            name: '黑龙江'
          },
          {
            name: '湖北'
          },
          {
            name: '湖南'
          },
          {
            name: '吉林'
          },
          {
            name: '江苏'
          },
          {
            name: '江西'
          }
        ],
        L_S: [
          {
            name: '辽宁'
          },
          {
            name: '内蒙古'
          },
          {
            name: '宁夏'
          },
          {
            name: '青海'
          },
          {
            name: '山东'
          },
          {
            name: '山西'
          },
          {
            name: '陕西'
          },
          {
            name: '上海'
          },
          {
            name: '四川'
          }
        ],
        T_Z: [
          {
            name: '天津'
          },
          {
            name: '台湾'
          },
          {
            name: '西藏'
          },
          {
            name: '新疆'
          },
          {
            name: '香港'
          },
          {
            name: '云南'
          },
          {
            name: '浙江'
          }
        ]
      },
      city: [],
      county: [],
      provinceCode: '',
      cityCode: '',
      isShowTab: false,
      isShowCommon: false,
      isShowProvince: false,
      isShowCity: false,
      isShowCounty: false
    };
  },
  watch: {
    provinceCode () {
      this.city = []
      this.county = []
      let provinceCode = this.provinceCode.substring(0, 2);
      // eslint-disable-next-line
      let city_list = area.city_list
      for (let i in city_list) {
        if (i.substring(0, 2) === provinceCode) {
          this.city.push({
            name: city_list[i],
            number: i
          })
        }
      }
    },
    cityCode () {
      this.county = []
      let cityCode = this.cityCode.substring(0, 4);
      // eslint-disable-next-line
      let county_list = area.county_list
      for (let i in county_list) {
        if (i.substring(0, 4) === cityCode) {
          this.county.push({
            name: county_list[i],
            number: i
          })
        }
      }
    }
  },
  methods: {
    // tab条
    showTabBox () {
      this.isShowTab = !this.isShowTab;
      if (this.isShowTab) {
        this.bindTap('common');
      } else {
        this.isShowCommon = false;
        this.isShowProvince = false;
        this.isShowCity = false;
        this.isShowCounty = false;
        // this.city = [];
        // this.county = [];
      }
    },
    // 跳转tab
    bindTap (type) {
      switch (type) {
        case 'common':
          this.isShowCommon = true;
          this.isShowProvince = false;
          this.isShowCity = false;
          this.isShowCounty = false;
          break;
        case 'province':
          this.isShowCommon = false;
          this.isShowProvince = true;
          this.isShowCity = false;
          this.isShowCounty = false;
          break;
        case 'city':
          this.isShowCommon = false;
          this.isShowProvince = false;
          this.isShowCity = true;
          this.isShowCounty = false;
          break;
        case 'county':
          this.isShowCommon = false;
          this.isShowProvince = false;
          this.isShowCity = false;
          this.isShowCounty = true;
          break;
      }
      this.tabChange(type);
    },
    // tab选择css控制
    tabChange (type) {
      this.tab.forEach(e => {
        if (e.value === type) {
          e.selected = true;
        } else {
          e.selected = false;
        }
      });
    },
    // 选择常用
    bindCommon (name) {
      let city_list = area.city_list
      let provinceList = area.province_list
      let provinceName = ''
      for (let i in city_list) {
        if (city_list[i].includes(name)) {
          this.provinceCode = i.substring(0, 2)
          break;
        }
      }
      for (let i in provinceList) {
        if (i.substr(0, 2) === this.provinceCode) {
          provinceName = provinceList[i]
          break;
        }
      }
      this.$emit('setRegions', provinceName, 'province');
      if ('北京市'.includes(name) || '天津市'.includes(name) || '上海市'.includes(name) || '重庆市'.includes(name)) {
        this.textToCode(name, 'city');
        this.bindTap('county');
        this.$emit('setRegions', name, 'city');
      } else {
        this.bindCity(name);
      }
    },
    // 选择省区
    bindProvince (name) {
      let province_list = area.province_list
      for (let i in province_list) {
        if (province_list[i].includes(name)) {
          name = province_list[i]
        }
      }
      this.$emit('setRegions', name, 'province');
      this.textToCode(name, 'province');
      if ('北京市'.includes(name) || '天津市'.includes(name) || '上海市'.includes(name) || '重庆市'.includes(name)) {
        this.textToCode(name, 'city');
        this.bindTap('county');
        this.$emit('setRegions', name, 'city');
      } else {
        this.bindTap('city');
        this.textToCode(name, 'province');
      }
    },
    // 选择市区
    bindCity (name) {
      this.textToCode(name, 'city');
      this.bindTap('county');
      this.$emit('setRegions', name, 'city');
      this.$emit('setRegions', '', 'county');
    },
    // 选择县区
    bindCounty (name) {
      name = name === '暂不选择' ? '' : name;
      if (name) {
        let cityCode = this.county.find(e => name === e.name).number.substring(0, 4);
        let cityName = this.city.find(e => e.number.substring(0, 4) === cityCode).name;
        this.provinceCode = cityCode.substring(0, 2);
        let province_list = area.province_list
        let provinceName = ''
        for (let i in province_list) {
          if (i.substring(0, 2) === cityCode.substring(0, 2)) {
            this.provinceCode = i.substring(0, 2)
            provinceName = province_list[i]
          }
        }
        this.$emit('setRegions', provinceName, 'province');
        this.$emit('setRegions', cityName, 'city');
      }
      this.$emit('setRegions', name, 'county');
      this.showTabBox();
    },
    textToCode (name, type) {
      if (type === 'province') {
        let province_list = area.province_list
        for (let i in province_list) {
          if (province_list[i].includes(name)) {
            this.provinceCode = i.substring(0, 2)
          }
        }
      } else if (type === 'city') {
        let city_list = area.city_list
        for (let i in city_list) {
          if (city_list[i].includes(name)) {
            this.cityCode = i.substring(0, 4)
          }
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
#address {
  position: relative;
}
.address-box {
  position: relative;
  cursor: pointer;
  i {
    width: 10px;
    height: 10px;
    position: absolute;
    right: 4px;
    top: 6px;
    color: #999;
    margin-right: 10px;
  }
  .el-input /deep/ .el-input__inner {
    pointer-events: none;
  }
}
.tab-wrap {
  position: absolute;
  top: 32x;
  z-index: 10;
  width: 420px;
  .tab-list {
    width: 100%;
    display: flex;
    justify-content: space-around;
    .tab:nth-of-type(1) {
      border-left: 1px solid #dcdfe6;
    }
    .tab {
      background-color: #f4f4f4;
      border-bottom: 1px solid #dcdfe6;
      border-right: 1px solid #dcdfe6;
      flex-grow: 1;
      cursor: pointer;
      text-align: center;
      a {
        color: #000;
      }
    }
    .select {
      background-color: #fff;
      border-bottom-color: #fff;
      a {
        color: #317ee7;
      }
    }
  }
  .tab-box {
    background-color: #fff;
    border-left: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    padding: 10px;
    a {
      display: inline-block;
      padding: 2px 10px;
      white-space: nowrap;
      color: #666;
    }
    a:hover {
      background-color: #86b4f1;
      color: #fff;
    }
    .forEnglish {
      float: right;
      padding: 0;
      padding-right: 10px;
      color: #317ee7;
      cursor: pointer;
    }
  }
  .province-box {
    padding-left: 20px;
    dt {
      float: left;
    }
    dd {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      a {
        padding: 0 10px;
        width: 56px;
      }
    }
  }
  .city-box,
  .county-box {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
