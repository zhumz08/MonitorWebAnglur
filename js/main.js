'use strict';

/* Controllers */


var treedata_avm = [];
var tree  = null;
var selectCameraId = null;
var commonOcxObj = document.getElementById("commonOcx");
var userKey = null;

angular.module('app')
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window','mePageLoading','$state',
    function(              $scope,   $translate,   $localStorage,   $window,mePageLoading,$state) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: '云南省高速公路收费业务监控系统',
        version: '1.3.3',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:   '#2e7cfa',  //'#4fc3f7',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-dark',
          navbarCollapseColor: 'bg-info',
          asideColor: 'bg-dark',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      }

      $scope.showLoad = function(){
        // 手动调用动画
        mePageLoading.show('Circle');
        /* setTimeout(function(){
         mePageLoading.hide();
         }, 1500);*/
      };

      $scope.hideLoad = function(){
        /* setTimeout(function(){
         mePageLoading.hide();
         }, 1500);*/
        // 手动调用动画
        mePageLoading.hide();
      };

     // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
       //$scope.app.settings = $localStorage.settings;
      } else {
      //  $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = false;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {zh_CN:"简体中文",en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = /*$scope.langs[$translate.proposedLanguage()] || */"简体中文";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

      $scope.addTab = function(path,title){
        mainAppTabs.push({title:title,path:path});
      }



      $scope.userLogout = function(){
        try{
          $scope.userInfo = false;

          logout();

          $state.go("access.signin");
        }catch(e){
          window.frames["videoFrame"].log.debug("error" + e);
        }


        return;
        /*  try{
         var retVal = window.parent.frames['videoFrame'].logout();
         if(retVal){
         $scope.userInfo = null;
         }
         }catch(e){
         console.error(e);
         }*/
      }


      $scope.mainAppTabs = [{
        title:'应用中心',
        isMain: true,
        close: false,
        path:'view/mainApp.html',
        active:true
      }];


      $scope.titleMap= { };
      $scope.openMainTab = function(tab){
        var idx = $scope.titleMap[tab.title];
        if(!idx){
          var idx = $scope.mainAppTabs.push(tab);
          $scope.titleMap[tab.title] = idx;
        }else{
          tab = $scope.mainAppTabs[idx-1];
        }
        tab.active = true;
      }

      $scope.closeMainTab = function (idx,tab) {
        $scope.titleMap[tab.title] = false;

        $scope.mainAppTabs.splice(idx,1);
      }

    }]);




function OnSDKMessageEvent(lMsgType, strContent) {
  try{
   // alert(lMsgType +"  "+ strContent);
    switch (lMsgType) {
      //心跳
      case 0x0000: {
        // log.debug("回调事件. 心跳   类型："+lMsgType);
        return;
      }
      //返回登录信息
      case 0x0002: {
       // alert("strConent:" + strContent);
        var videoFrame = window.frames["videoFrame"].log.debug("登录:" + strContent);
        returnLogin(strContent);
        break;
      }
      //收到某一个摄像机关联的Host信息---实时播放回调
      case 1541: {
        // log.debug("回调事件. 收到某一个摄像机关联的Host信息   类型："+lMsgType);
        var videoFrame = window.frames["videoFrame"];
        videoFrame.returnStartLive(getXMLDoc(strContent));
        break;
      }
      case 1550: // 历史视频播放 调用StartVod 返回结果
      {
        //log.debug("回调事件. 播放视频   类型："+lMsgType);
        returnStartVod(strContent);
        break;
      }
      case 1553: //  通知时间线信息
      {
        //log.debug("视频播放时间线事件：" + strContent);
        try {
          var xmlDoc = getXMLDoc(strContent);
          var elements = xmlDoc.getElementsByTagName("uiPosition");
          var curTime = parseInt(elements[0].firstChild.nodeValue);
          //top.mainPage.timeLineObj.SetPlayTimeShow(curTime);
          timeLineObj.SetPlayTimeShow(curTime);
        }
        catch (e) {
        }
        break;
      }
      case 1564: // 摄像机组信息列表
      {
        window.frames["videoFrame"].log.debug("获取摄像机组信息   类型：" + lMsgType);
        var videoFrame = window.frames["videoFrame"];
        videoFrame.returnGetCarmGroupList(getXMLDoc(strContent));
        break;
      }
      // 返回实时摄像机列表
      case 1566: {
        //log.debug("获取摄像机列表   类型：" + lMsgType);
        //treeObj.parseGroupXML(strContent);
        var videoFrame = window.frames["videoFrame"];
        videoFrame.returnGetCarmList(getXMLDoc(strContent));

        break;
      }
      // 返回某一路摄像机历史记录
      case 1568: {
        log.debug("回调事件. 返回相机历史记录   类型：" + lMsgType);
        returnGetCamHisVideo(strContent);
        break;
      }
      default:
        //log.debug("信息类型:"+lMsgType + "信息内容:"+ strContent);
        break;
    }
  }catch(e){
    window.frames["videoFrame"].log.debug("Error errr" + e);
  }
}


/**
 * 通讯控件返回的  登录动作反馈
 * @param content 返回的登陆信息-xml格式
 */
function returnLogin(content)
{
 try{
   var xmlDoc = getXMLDoc(content);
   var key = -1;
   var descption = "";
   var elements = xmlDoc.getElementsByTagName("RetUserLogin");
   for (var i = 0; i < elements.length; i++)
   {
     try
     {
       key = elements[i].getElementsByTagName("ret")[0].getElementsByTagName("iValue")[0].firstChild.nodeValue;
       descption = elements[i].getElementsByTagName("ret")[0].getElementsByTagName("description")[0].firstChild.nodeValue;
     }
     catch(e)
     {
     }
   }

   //登录成功
   if (key == 0)
   {
     //log.debug("登录成功 ");
     //$("#dl>span").text('注销');
     //$("#loginlogspan").hide();
     //isLogin = true;

     //欢迎信息用户名显示。
     //$(".loginName").text(username);
     //$(".welcome").show();

     //列出相机组、相机列表
     //log.debug("获取摄像机组,摄像机信息.");
     commonOcxObj.GetCameraGroup(userKey);
     //commonOcxObj.GetCamera(userKey);
   }
   else
   {
     //登录失败 --重新打开登录框，并显示登录失败信息
     //log.error("登录失败 ：" + descption);
     //$("#loginlogspan").show();
     //$("#loginlogspan").text("登录失败:" + descption);
     //log.warn("登录失败:" + descption)
     hideActive(0);
     // $("#logindiv").dialog("open");
   }
 }catch(e){
   window.frames["videoFrame"].log.debug("ERROR" + e);
 }
}



/**
 * 解析XML
 */
function getXMLDoc(xmlString)
{
  var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
  for (var i = 0; i < xmlDomVersions.length; i++)
  {
    try
    {
      var xmlDoc = new ActiveXObject(xmlDomVersions[i]);
      xmlDoc.async = false;
      xmlDoc.loadXML(xmlString);
      return xmlDoc;
    }
    catch (e)
    {
      // log.warn(e);
      window.frames["videoFrame"].log.debug("Error"+e);
    }
  }
}




/**
 * 用户注销
 */
function logout()
{
  /*///////////////////////////////////////////////////////////////
   {
   log.debug("用户注销.");
   // 清除日志
   log.clear();
   //清空左侧摄像机列表区
   realTree.deleteChildItems(0);
   hisTree.deleteChildItems(0);
   videoTree.deleteChildItems(1);
   }

   $("#dl>span").text('登录');
   $(".welcome").hide();

   //左侧恢复到摄像头菜单区
   $('#shexiangjili').trigger('click');
   //右侧区域 变为首窗口单屏
   showLayout(1);
   isLogin=false;*/

 try{
   if (commonOcxObj != null)
   {
     return commonOcxObj.UserLogout(userKey);
   }
 }catch(e){
   console.error("window logout"+e);
 }
  return 1;
}


function AngularPost($http, url, data, doSuccess, doError) {
  $http({
    method: 'POST',
    url: "/MonitorWeb/web" + url,
    data: $.param(data),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }).success(function (data) {
    if (doSuccess) {
      doSuccess(data);
    }
  }).error(function (errOut) {
    if (doError) {
      doError(errOut);
    }
  });
}