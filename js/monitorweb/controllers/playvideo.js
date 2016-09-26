/**
 * Created by mjang on 2016/8/27.
 */

app.controller('RealTimeVideoCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.videoPosition = 1; //相机预置位
    $scope.showToolbar = '';

    ////放大缩小按钮变化
    $scope.sliderChange = function(id,param){
        if(param=='zoomIn'){
            var slider = angular.element("#"+id);
            //slider.slider('showTooltip');

            var val = slider.slider('getValue');
            val = val -1;
            slider.slider('setValue',val);
        }
        if(param=='zoomOut'){
            var slider = angular.element("#"+id);
            //slider.slider('showTooltip');

            var val = slider.slider('getValue');
            val = val+1;
            slider.slider('setValue',val);
        }
    }

    //放大缩小变化
    $scope.setVideoPosition = function(val){
        if(val=='del'){ //删除一位
            var subLen = $scope.videoPosition.length-1;
            if(subLen>=0){
                $scope.videoPosition = $scope.videoPosition.substring(0,subLen);
            }
            return;
        }
        if(val=='C'){
            $scope.videoPosition = "";
            return;
        }
        if($scope.videoPosition.length>=3){
            return;
        }
        $scope.videoPosition = $scope.videoPosition + val;
    }


    ///实时播放ptz
    $scope.playInit = function(){
        //PTZ操作
        $(".ptzlink").mousedown(function()
        {
            var btnName = $(this).attr("btnName");
            $(this).find("img").attr("src","img/PTZ/"+btnName+"-click.png");

            // alert($(this).attr('name'));
            window.frames["videoFrame"].PTZOperator($(this).attr('name'), 'down');
        }).mouseup(function(){
            var btnName = $(this).attr("btnName");
            window.frames["videoFrame"].PTZOperator($(this).attr('name'), 'up');
        });

        $(".ptzlink").hover(function(){
            var btnName = $(this).attr("btnName");
            $(this).find("img").attr("src","img/PTZ/"+btnName+"-black.png");
        }, function(){
            var btnName = $(this).attr("btnName");
            $(this).find("img").attr("src","img/PTZ/"+btnName+"-default.png");
        })


        $(".ptzlink").each(function(){
            var btnName = $(this).attr("btnName");
            $(this).find("img").attr("src","img/PTZ/"+btnName+"-default.png");
        });

    }

    $scope.tooltitle = '';
    $scope.hideToolbar = function(){
        var toolBarEl = angular.element("#toolBar");
        if(toolBarEl.hasClass("w-lg")){
            toolBarEl.removeClass("w-lg");
            toolBarEl.addClass("w-xxxs");
            $scope.tooltitle = 'hidden';
            $("#videoFrame").css("padding-right","0px");
        }else{
            toolBarEl.removeClass("w-xxxs");
            toolBarEl.addClass("w-lg");

            $("#videoFrame").css("padding-right","260px");

            $scope.tooltitle = '';
        }
    }

}]);


/**
 * 主页的Ctrl
 */
app.controller('MainMenuCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {

    $scope.app_menu_url= 'view/app_menu/video_app.html';

    $scope.menuList = [
        {name:"视频监控",path:"view/app_menu/video_app.html", icon: 'icon_video.png',selected:'true'},
        {name:"智能分析和检索",path:"view/app_menu/kakou_app.html",icon:'icon_analyse.png'},
        {name:"数据管理",path:"view/app_menu/face_app.html",icon:'icon_data.png'},
        {name:"存储管理",path:"view/app_menu/face_app.html",icon:'icon_datastore.png'},
        {name:"配置管理中心",path:"view/app_menu/face_app.html",icon:'icon_settingmgr.png'},
        {name:"任务计划管理",path:"view/app_menu/face_app.html",icon:'icon_plan.png'},
        {name:"管理工具",path:"view/app_menu/face_app.html",icon:'icon_tools.png'},
        {name:"用户管理",path:"view/app_menu/face_app.html",icon:'icon_usermgr.png'}
    ];

    $scope.videoMenu = [
        {title:'实时视频',pic:'menu_realtime.png',path:'view/realtime/tab.html',close:true},
        {title:'电子地图',pic:'menu_map.png',close:true},
        {title:'历史视频调用',pic:'menu_history.png',close:true}
    ];

    /**
     * 菜单相似
     * @param v
     * @param event
     */

    $scope.changeMenu = function(v,event){
        $scope.app_menu_url = v.path;

        angular.element(".menuitem").removeClass("menuitemselect");
        angular.element(event.target).addClass("menuitemselect");
    }

}]);