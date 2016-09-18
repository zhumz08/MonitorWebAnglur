/**
 * Created by Administrator on 2015/12/18.
 */

angular.module('app')
    .directive('uiFoorow', function() {
        return function(scope,element){
           /** if(scope.$last && !$(".footable").hasClass('footable-loaded')){
                $(".footable").footable();
            }*/

/*
            var footableObj = $(".footable").data("footable");
            if(footableObj!=undefined){
               footableObj.appendRow($(element));
            }
*/

        }
    }
);