app.controller('AbnTestController', function($scope, $timeout) {
    var apple_selected,treedata_geography;
    $scope.playVideo = function(branch) {
        try{
            console.info("play video:" + branch.groupId);
            /*var _ref;
             $scope.output = "You selected: " + branch.label;
             if ((_ref = branch.data) != null ? _ref.description : void 0) {
             return $scope.output += '(' + branch.data.description + ')';
             }*/
            var groupId = branch.groupId;
            var currCameraId = groupId.substring(1,groupId.length);

            $("#roadPicId").attr("src","img/roadpic/" + currCameraId+".jpg");
            window.frames["videoFrame"].currCameraId = currCameraId;
            window.frames["videoFrame"].playCarmVideo(currCameraId);
        }catch(e){
            console.error("error" + e);
        }
    };

    apple_selected = function(branch) {
      return $scope.output = "APPLE! : " + branch.label;
    };


   /*treedata_avm = [];*/

  /* $scope.doTreeInit = function(){

     var treeObj = new TreeObject();
     treeObj.addNode(null,"1","相机列表");

     treeObj.addNode("1","2","相机1");
     treeObj.addNode("1","3","相机2");
     treeObj.addNode("1","4","相机3");

     treedata_avm.push(treeObj.rootNode[0]);

   }*/


  /*
  treedata_avm = [
    {
      label: '相机',
      children: [
        {
          label: '政立路淞沪路',
          data: {
            description: "我在这里办公"
          },
          children: [
            {
              label: '政学路淞沪路',
              data: {
                description: "我在这里吃饭"
              }
            }
          ]
        }, {
          label: '政立路国权北路',
          data: {
            description: "我在这里休息"
          }
        }, {
          label: '政立路武川路',
          data: {
            description: "我在这里泡妞"
          }
        }
      ]
    }
  ];*/
    treedata_geography = [
      {
        label: 'North America',
        children: [
          {
            label: 'Canada',
            children: ['Toronto', 'Vancouver']
          }, {
            label: 'USA',
            children: ['New York', 'Los Angeles']
          }, {
            label: 'Mexico',
            children: ['Mexico City', 'Guadalajara']
          }
        ]
      }, {
        label: 'South America',
        children: [
          {
            label: 'Venezuela',
            children: ['Caracas', 'Maracaibo']
          }, {
            label: 'Brazil',
            children: ['Sao Paulo', 'Rio de Janeiro']
          }, {
            label: 'Argentina',
            children: ['Buenos Aires', 'Cordoba']
          }
        ]
      }
    ];

    $scope.transData = function fn(data, pid) {
        var result = [], temp;
        for (var i = 0; i < data.length; i++) {
            if (data[i].pid == pid) {
                var obj = {"text": data[i].name,"id": data[i].id};
                temp = fn(data, data[i].id);
                if (temp.length > 0) {
                    obj.children = temp;
                }
                result.push(obj);
            }
        }
        return result;
    }


    $scope.my_data = treedata_avm;
    $scope.try_changing_the_tree_data = function() {
        var treeObj = new TreeObject();
        treeObj.addNode(null,"0","相机列表");
        treedata_avm.push(treeObj.rootNode[0]);

        $.get("http://localhost:8080/MonitorWebAnglur/data/tree_group.xml",null,function(data){

            var key = -1;
            var xmlDoc = data;
            var elements = xmlDoc.getElementsByTagName("RetGetCameraGroup");
            key = elements[0].getElementsByTagName("ret")[0].getElementsByTagName("iValue")[0].firstChild.nodeValue;
            if (key == 0) {
                var parentIdArray = new Array();
                var groupIdArray = new Array();
                var groupNameArray = new Array();

                var groups = xmlDoc.getElementsByTagName("CameraGroupRes");

                var jsonObj = [];
                for (var i = 0; i < groups.length; i++) {
                    var parentId = groups[i].getElementsByTagName("ubiParentId")[0].firstChild.nodeValue;
                    parentIdArray[i] = parentId;
                    var groupId = groups[i].getElementsByTagName("ubiCameraGroupId")[0].firstChild.nodeValue;
                    groupIdArray[i] = groupId;
                    var groupName = groups[i].getElementsByTagName("szName")[0].firstChild.nodeValue;
                    groupNameArray[i] = groupName;

                    //console.info("parentId:" + parentId + " groupId:" + groupId + " groupName:" + groupName);
                    //treeObj.addNode(parentId,groupId,groupName);

                    jsonObj.push({
                        "id":parentId,
                        "pid":groupId,
                        "name":groupName
                    });
                }

                var treeData = $scope.transData(treeObj,1);
                console.info(treeData);
            }


            try{
              /*  window.parent.treedata_avm.push(treeObj.rootNode[0]);
                window.parent.tree.expand_all();*/

            }catch(e){
                console.error("window.parent.treedata_avm error"+e);
            }
        });
/*
      if ($scope.my_data === treedata_avm) {
        return $scope.my_data = treedata_geography;
      } else {
        return $scope.my_data = treedata_avm;
      }*/

    };



    $scope.getTreeParent = function(pid, elems) {
        if (!elems) {
            return;
        }
        for (var i = 0, len = elems.length; i < len; i++) {
            var elem = elems[i];
            if (elem.ID == pid) {
                return elem;
            } else {
                return $scope.getTreeParent(pid, elem.chrild);
            }
        }
    }


    $scope.my_tree = tree = {};
    $scope.try_async_load = function() {
      $scope.my_data = [];
      $scope.doing_async = true;
      return $timeout(function() {
        if (Math.random() < 0.5) {
          $scope.my_data = treedata_avm;
        } else {
          $scope.my_data = treedata_geography;
        }
        $scope.doing_async = false;
        return tree.expand_all();
      }, 1000);
    };
    return $scope.try_adding_a_branch = function() {
      var b;
      b = tree.get_selected_branch();
      return tree.add_branch(b, {
        label: 'New Branch',
        data: {
          something: 42,
          "else": 43
        }
      });
    };
});