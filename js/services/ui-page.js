/**
 * Created by zhumz on 2016/9/17.
 */
/**
 * Created by mjang on 17/5/2016.
 */


app.service('Pager', function ($http,$rootScope) {

    var pager = {
        totalNum:0,
        pageIndex:1,
        pageSize:12,
        pageList:[],
        dataList:[],
        initPage: function(dataList,filter){
            if(!dataList){
                return;
            }
            this.pageClear();
            this.filterData(dataList,filter);
            this.totalNum = this.dataList.length;

            this.getPageList();
        },
        filterData:function(dataList,filter){
            if(!filter || filter.length==0) {
                this.dataList = dataList;
                return;
            }

            var dataTempList = [];
            for (var i = 0; i < dataList.length; i++) {
                var item = dataList[i];
                if (item.state && item.state != filter) {
                    continue;
                }
                dataTempList.push(item);
            }
            this.dataList = dataTempList;
        },
        getStartIndex: function(){
            if(this.getPageIndex()<=0){
                return 0;
            }
            return this.getPageIndex() * this.pageSize;
        },
        getEndIndex:function(){
            var endIndex = (this.getPageIndex()+1) * this.pageSize;
            return (endIndex > this.totalNum) ? this.totalNum:endIndex;
        },
        getPageIndex: function(){
            this.pageIndex = (this.pageIndex< 0) ? 0:this.pageIndex;

            return (this.pageIndex-1);
        },
        getPageList: function(){
            this.pageList = [];

            var startIndex = this.getStartIndex();
            var endIndex = this.getEndIndex();

            for(var k=startIndex; k<=(endIndex-1); k++){
                this.pageList.push(this.dataList[k]);
            }
        },
        addMore: function(){
            if(!this.hasMore()){
                return;
            }
            this.pageIndex++;
            var startIndex = this.getStartIndex();
            var endIndex = this.getEndIndex();

            for(var k=startIndex; k<=(endIndex-1); k++){
                this.pageList.push(this.dataList[k]);
            }
        },
        hasMore:function(){
            if(this.getEndIndex()>=this.totalNum){
                return false;
            }
            return true;
        },
        removeItem: function(data){
            this.dataList.splice(this.dataList.indexOf(data),1);
            this.pageList.splice(this.pageList.indexOf(data),1);
            this.totalNum = this.totalNum -1;

            this.getPageList();
        },

        pageChanged:function(){
            this.getPageList();
        },
        pageClear:function(){
            this.dataList = [];
            this.pageList = [];
            this.totalNum = 0;
            this.pageIndex = 1;
        }
    };

    return pager;

});

app.directive("pageSelect",function(){
    return {
        scope:"=",
        template: "每页<select ng-options='val for val in [5,10,15,18,21,24,28,30,35]' ng-model='pager.pageSize' ng-change='pager.pageChanged()'></select>条"
    };
});