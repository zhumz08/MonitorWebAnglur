/**
 * Created by mjang on 2016/8/28.
 */

var node_parentId = "parentId";
var node_groupId = "groupId";
var node_Label = "label";
var node_Children = "children";

/**
 var treeObj = new TreeObject();
 treeObj.addNode(null,"1","相机列表");
 treeObj.addNode("1","01","政立路相机01");
 treeObj.addNode("1","02","政立路相机02");

 treeObj.addNode("01","011","政立路相机011");
 treeObj.addNode("02","021","政立路相机021");

 treeObj.addNode("011","0111","政立路相机0111");
 treeObj.addNode("021","0211","政立路相机0211");

 treeObj.addNode("0111","01111","政立路相机01111");
 treeObj.addNode("0211","02111","政立路相机02111");

 */

function TreeObject(){

}

TreeObject.prototype = {
    rootNode:[],
    jsonData: null,
    groupXML:null,

    /**
     *  json[{groupId:2,parentId:1,name:'aa'},{groupId:2,parentId:1,name:'bb'}]
     * @param jsonData
     */
    init: function(jsonData){
        this.jsonData = jsonData;
    },
    transData: function(dataMap){
        ///先添加根节点
        ///var rootNode = dataMap[0];
        var rootNode ;
        if(rootNode==null){
            rootNode = [{"id":"1","text":"相机列表","iconCls":"icon-camera-group","children":[],parentId:0,groupId:0,state:'closed'}];
        }
        this.rootNode = rootNode;

        //递归添加所有的子节点
        var rootLen = this.rootNode.length;


        for(var i=0; i< rootLen; i++){
            var tmpNode = this.rootNode[i];

            //获取组的信息
            this.addGroupData(tmpNode,dataMap);
        }
    },
    findChildGroup:function(groupXML,tgroupid,groupArr){

        var elements = groupXML.getElementsByTagName("RetGetCameraGroup");
        var groups = groupXML.getElementsByTagName("CameraGroupRes");
        var flag = false;

        var temp2 =0;

        var temp =0;
        for(var j=0; j<groupArr.length; j++){
            if(tgroupid == groupArr[j]){
                temp = 1;
                break;
            }
        }

    },
    findParentGroup:function(groupXML,Tgroupid,hasCameraGroup) {
        var groups = groupXML.getElementsByTagName("CameraGroupRes");

        for (var i = 0; i < groups.length; i++) {
            var parentId = groups[i].getElementsByTagName("ubiParentId")[0].firstChild.nodeValue;
            var groupId = groups[i].getElementsByTagName("ubiCameraGroupId")[0].firstChild.nodeValue;

            if(Tgroupid == groupId){
                console.info("parentId:" + parentId + " groupId:" + groupId);
                hasCameraGroup.push(groupId);
                if(parentId != 0 ){
                    this.findParentGroup(groupXML,parentId,hasCameraGroup);
                }else{
                    return hasCameraGroup;
                }
                break;
            }
        }

        return hasCameraGroup;

    },

    parseGroupXML:function(groupXML) {
        this.groupXML = groupXML;
    },
    parseCameraGroupXML:function(cameraXmlDoc){
        var groupXML = this.groupXML;

        /////////////////////////////
        ///相机信息///
        var elementsC = cameraXmlDoc.getElementsByTagName("CameraRes");
        var groupArr = [];
        var hasCameraGroup =[];
        for (var i = 0; i < elementsC.length; i++)
        {
            var groupId = elementsC[i].getElementsByTagName("ubiCameraGroupId")[0].firstChild.nodeValue;

            if(i!=0){
                if(groupArr[groupArr.length-1] == groupId){

                }else{
                    groupArr.push(groupId);
                    hasCameraGroup = this.findParentGroup(groupXML,groupId,hasCameraGroup);
                    console.info(groupId+"-----"+hasCameraGroup);
                }
            }
        }

        var groupCameraCount = [];
        for (var i = 0; i < groupArr.length; i++){
            var count =0;
            for (var j = 0; j < elementsC.length; j++){
                var groupId = elementsC[j].getElementsByTagName("ubiCameraGroupId")[0].firstChild.nodeValue;
                if(groupArr[i] ==groupId){
                    count = count+1;
                }
            }
            groupCameraCount.push(count);
        }


        //////////////////////////////

        var elements = groupXML.getElementsByTagName("RetGetCameraGroup");
        var key = elements[0].getElementsByTagName("ret")[0].getElementsByTagName("iValue")[0].firstChild.nodeValue;

        var groupMap = new Object();
        if (key != 0) {
            return groupMap;
        }

        var groups = groupXML.getElementsByTagName("CameraGroupRes");


        for (var i = 0; i < groups.length; i++) {
            var parentId = groups[i].getElementsByTagName("ubiParentId")[0].firstChild.nodeValue;
            var groupId = groups[i].getElementsByTagName("ubiCameraGroupId")[0].firstChild.nodeValue;
            var groupName = groups[i].getElementsByTagName("szName")[0].firstChild.nodeValue;

            for(var j = 0;j<groupArr.length;j++){
                if(groupArr[j] ==groupId ){
                    groupName =groupName +"("+groupCameraCount[j]+")";
                }
            }

            var flag =0;
            for(var j = 0;j<hasCameraGroup.length;j++){
                if(groupId ==hasCameraGroup[j] ){
                    flag = 1;
                    break;
                }else{

                }
            }

            if(flag == 1){

            }else{
                continue;
            }


            var groupNode = {
                parentId: parentId,
                groupId: groupId,
                text: groupName,
                "id": groupId,
                "iconCls": "icon-camera-group",
                children: [],
                state:'closed'
            };

            var tempGroup = groupMap[parentId];
            if (tempGroup == null) {
                groupMap[parentId] = [];
            }
            groupMap[parentId].push(groupNode);
            //console.info("parentId:" + parentId + " groupId:" + groupId + " groupName:" + groupName);
        }
        this.transData(groupMap);

    },
    parseCameraXML:function(cameraXmlDoc,treeId){
        var elements = cameraXmlDoc.getElementsByTagName("CameraRes");
        var cameraMap = new Object();
        for (var i = 0; i < elements.length; i++)
        {
            var groupId = elements[i].getElementsByTagName("ubiCameraGroupId")[0].firstChild.nodeValue;
            var id = elements[i].getElementsByTagName("ubiCameraId")[0].firstChild.nodeValue;
            var name = elements[i].getElementsByTagName("szName")[0].firstChild.nodeValue;

            var cameraNode = {
                parentId:groupId,
                text: name + "["+id+"]",
                "id": "C"+id,
                "iconCls": "icon-camera"
            };

            var cameraData = cameraMap[groupId];
            if (cameraData == null) {
                cameraMap[groupId] = [];
            }
            cameraMap[groupId].push(cameraNode);
            //console.info("parentId:" + groupId + " id:" + id + " groupName:" + groupName);
        }

        this.addCameraData(treeId,cameraMap);
    },
    addGroupData: function(tmpNode,dataMap){

        var groupId = tmpNode.groupId;
        var groupData = dataMap[groupId];
        if(groupData==null){
            return;
        }else{
            for(var k=0; k<groupData.length; k++){
                var subNode = groupData[k];
                tmpNode.children.push(subNode);

                this.addGroupData(subNode,dataMap);
            }
        }
    },

    addCameraData: function(treeId,cameraMap){
        for(var groupId in cameraMap){
            var groupData = cameraMap[groupId];
            this.appendNode(treeId,groupId,groupData);
        }
    },

    getRootNode: function(){

        return this.rootNode;
    },

    addNode: function(subNode){

        var newNode = this.createNode(subNode);
    },

    appendNode: function(treeId,groupId,groupData) {

        var groupNode = $("#" + treeId).tree('find', groupId);
        $('#' + treeId).tree('append', {
            parent:groupNode.target,
            data: groupData
        });
    },

    getNode: function(parentId){

        return this.findNode(parentId,this.rootNode[0]);
    },

    createNode: function(subNode){

        return subNode;
    }
}

