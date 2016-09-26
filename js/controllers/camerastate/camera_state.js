app.controller('CameraStateCtrl', ['$scope','$http','Pager', function($scope,$http,pager) {

    $scope.pager = pager;
    $scope.pager.pageClear();
    $scope.pager.pageSize = 18;

    $scope.tableTitleList = [];

    $scope.hours = [];
    for(var i=0;i<24;i++){
        if(i<10){
            $scope.hours.push("0"+i);
            continue;
        }
        $scope.hours.push(i);
    }

    $scope.minutes = [];
    for(var i=0;i<60;i++){
        if(i<10){
            $scope.minutes.push("0"+i);
            continue;
        }
        $scope.minutes.push(i);
    }

    $scope.initCameraState = function(){
        $scope.tableTitleList.push("序号");
        $scope.tableTitleList.push("国标编号");
        $scope.tableTitleList.push("摄像机名称");
        $scope.tableTitleList.push("IP地址");
        $scope.tableTitleList.push("在线状态");
        $scope.tableTitleList.push("是否录像");
        $scope.tableTitleList.push("时间");
        $scope.tableTitleList.push("录像状态");
        $scope.tableTitleList.push("行政区划");
        $scope.tableTitleList.push("管理部门");
        $scope.tableTitleList.push("相机类型");
        $scope.tableTitleList.push("可控");
        $scope.tableTitleList.push("用途");
        $scope.tableTitleList.push("启用标志");
        $scope.tableTitleList.push("制高点");
        $scope.tableTitleList.push("相机厂商");
        $scope.tableTitleList.push("承建单位");
        $scope.tableTitleList.push("建设单位");
    }


    $scope.chkList = [
        {"colname":"v_mac","name":"MAC地址"},
        {"colname":"v_dwmc","name":"所属点位名称"},
        {"colname":"v_lkmc","name":"所属路口名称"},
        {"colname":"v_twkg","name":"透雾开关"},
        {"colname":"v_gd","name":"PGIS经纬度"},
        {"colname":"v_wd","name":"GIS经纬度"},
        {"colname":"v_azrq","name":"安装日期"},
        {"colname":"v_bzqz","name":"维保期至"},
        {"colname":"v_yt_htbh","name":"云台合同编号"},
        {"colname":"v_jt_htbh","name":"镜头合同编号"},
        {"colname":"v_gcbh","name":"工程信息编号"},
        {"colname":"v_zrbm","name":"设备责任人部门"},
        {"colname":"v_zrr_lxdh","name":"设备责任人联系电话"},
        {"colname":"v_jydw","name":"检验单位"},
        {"colname":"v_lrr","name":"录入人"}
    ];


    $scope.selectList = [];
    $scope.selectList.push({
        "name":"行政区划",
        "colname": "v_xzqh", //数据库字段名
        require: true,
        "options":[
            {"key":-1,"value":"全部"},
            {"key":00,"value":"交管支队"},
            {"key":01,"value":"市辖区"},
            {"key":02,"value":"东河区"},
            {"key":03,"value":"昆都仑区"},
            {"key":04,"value":"青山区"},
            {"key":05,"value":"石拐区"},
            {"key":06,"value":"白云鄂博矿区"},
            {"key":07,"value":"九原区"},
            {"key":21,"value":"土默特右旗"},
            {"key":22,"value":"固阳县"},
            {"key":23,"value":"达尔罕茂明安联合旗"}
        ]
    });

    $scope.selectList.push({
        "name":"管理部门",
        "colname": "v_glbm", //数据库字段名
        "options":[
            {"key":-1,"value":"全部"},
            {"key":00,"value":"交警支队"}
        ]
    });

    $scope.selectList.push({
        "name":"相机类型",
        "colname": "v_xjlx", //数据库字段名
        "queryName:":'q_xjlx',
        "options":[
            {"key":-1,"value":"全部"},
            {"key":0,"value":"枪机"},
            {"key":1,"value":"球机"},
            {"key":2,"value":"其他"}
        ]
    });

    $scope.selectList.push({
        "name":"相机可控",
        "colname": "v_sfkk", //数据库字段名
        "options":[
            {"key":-1,"value":"全部"},
            {"key":1,"value":"是"},
            {"key":2,"value":"否"}
        ]
    });

    $scope.selectList.push({
        "name":"相机用途",
        "colname": "tbl_xzqh", //数据库字段名
        "options":[
            {"key":-1,"value":"全部"},
            {"key":-1,"value":"未知"},
            {"key":0,"value":"治安"},
            {"key":1,"value":"交通"},
            {"key":2,"value":"重点部位"}
        ]
    });

    $scope.selectList.push({
        "name":"启用标志",
        "colname": "tbl_xzqh", //数据库字段名
        "options":[
            {"key":-1,"value":"全部"},
            {"key":1,"value":"启用"},
            {"key":2,"value":"停用"},
            {"key":3,"value":"已拆除"},
            {"key":4,"value":"故障"},
            {"key":5,"value":"测试"}
        ]
    });

    $scope.selectList.push({
        "name":"在线状态",
        "colname": "v_online", //数据库字段名
        "options":[
            {"key":-1,"value":"全部"},
            {"key":0,"value":"离线"},
            {"key":1,"value":"在线"}
        ]
    });

    $scope.selectList.push({
        "name":"制高点位",
        "colname": "tbl_xzqh", //数据库字段名
        "options":[
            {"key":-1,"value":"全部"},
            {"key":1,"value":"是"},
            {"key":2,"value":"否"}
        ]
    });

    $scope.selectList.push({
        "name":"相机厂商",
        "colname": "v_xjcs", //数据库字段名
        "options":[
            {"key":-1,"value":"全部"},
            {"value":"海康","key":0},
            {"value":"大华","key":2},
            {"value":"宇视","key":4},
            {"value":"其他","key":9}
        ]
    });

    $scope.selectList.push({
        "name":"承建单位",
        "colname": "v_jsdw", //数据库字段名
        "options":[
            {"key":-1,"value":"全部"},
            {"key":1,"value":"分局自建"},
            {"key":2,"value":"市局建"} //5-7市局建
        ]
    });

    $scope.selectList.push({
        "name":"建设单位",
        "colname": "v_jsdw", //数据库字段名
        "options":[
            {"key":-1,"value":"全部"},
            {"key":1,"value":"分局自建"},
            {"key":2,"value":"分局自建"},
            {"key":3,"value":"分局社会资源接入"},
            {"key":4,"value":"分局社会资源接入"},
            {"key":5,"value":"市局建设"},
            {"key":6,"value":"市局社会资源接入"},
            {"key":7,"value":"市局社会资源接入"},
            {"key":8,"value":"交管支队建设"},
            {"key":9,"value":"交管支队社会资源接入"}
        ]
    });

    $scope.cameraStateList = [
        [{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"}],
        [{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"}],
        [{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"},{value:"val"}]
    ];


    $scope.colNameMap = {
        "v_xjbh": "相机编号",
        "v_xjmc": "摄像机名称",
        "v_ipdz": "IP地址",
        "v_mac": "MAC地址",
        "v_online": "在线状态",
        "v_isStore": "是否录像",
        "v_store_state": "录像状态",
        "v_updateTime": "时间",
        "v_xzqh": "行政区划",
        "v_glbm": "管理部门",
        "v_xjlx": "相机类型",
        "v_sfkk": "是否可控",
        "v_yt": "用途",
        "v_qybz": "启用标志",
        "v_zgd": "制高点",
        "v_xjcs": "相机厂商",
        "v_dwmc": "点位名称",
        "v_lkmc": "路口名称",
        "v_twkg": "透雾开关",
        "v_gd": "经度",
        "v_wd": "纬度",
        "v_azrq": "安装日期",
        "v_bzqz": "保质期至",
        "v_jsdw": "承建单位",
        "v_yt_htbh": "云台合同编号",
        "v_jt_htbh": "镜头合同编号",
        "v_gcbh": "工程信息编号",
        "v_zrbm": "设备责任部门",
        "v_zrr_lxdh": "联系电话",
        "v_jydw": "检验单位",
        "v_lrr": "录入人"
    };


    $scope.tranTitle = function(title){
       return $scope.colNameMap[title];
    }


    $scope.result = {};
    $scope.doSearch = function(){
        var startDay = angular.element("#startDay").val();
        var endDay = angular.element("#startDay").val();
        if(endDay > startDay){
            alert("开始时间不对大于结束时间");
            return false;
        }
        $scope.showLoad();

        var formStr = $("#cameraStateForm").serializeArray();

        AngularPost($http,"/camerastate/query",formStr,function(data){
            $scope.result = data;

            $scope.pager.initPage($scope.result.resultList);

            $scope.hideLoad();
        },function(data){
            $scope.result = data;
            console.info("Error========")
            $scope.hideLoad();
        });
    }

    $scope.doExportXls = function(){
        $scope.showLoad();

        var formStr = $("#cameraStateForm").serializeArray();
        formStr.push({name:"exportXls",value:true});

        AngularPost($http,"/camerastate/query",formStr,function(data){
            $scope.hideLoad();

            window.location = "/MonitorWeb/export/xls/" + data.resultList;
        },function(data){
            $scope.hideLoad();

            console.info("Error========");
        });
    }



}]);

/**
 * Created by zhumz on 2016/9/14.
 */
