function TabsCtrl($scope, $timeout) {

    var sortableEle;

    $scope.tabs = [
        {id: 'home', title:'Home', content:'1111', active: true}
        ,{id: 'profile', title:'Profile', content:'222', active: true}
        ,{id: 'contacts', title:'Contacts', content:'333', active: true}
    ];

    $scope.init = function(){
        $scope.last_id = 0;
        $scope.active_tab = _.find($scope.tabs, function(tab){
            return tab.active;
        });
        _.each($scope.tabs, function(tab){
            if(tab!=$scope.active_tab)
                tab.active = false;
        });
        sortableEle = $('.nav-tabs').sortable({
            axis: 'x',
            angular_compatible: true,
            items: 'li:not(.add-new)',
            start: $scope.dragStart,
            beforeStop: $scope.dragBeforeStop,
            stop: $scope.dragStop
        });
    };

    $scope.swithToEditMode = function($event){
        this.tab.isEditMode = true;
        $timeout(function(){
            $($event.target).siblings('input').focus();
        });
    }

    $scope.swithToShow = function($event){
        this.tab.isEditMode = false;
    }

    $scope.dragStart = function(e, ui) {
        ui.item.data('start', ui.item.index());
    }

    $scope.dragBeforeStop = function(e, ui) {
        var start = ui.item.data('start'),
            end = ui.placeholder.index();
        $scope.tabs.splice(end, 0,
            $scope.tabs.splice(start, 1)[0]);

    }
    $scope.dragStop = function(e, ui) {
        sortableEle.sortable( "cancel" );
    }

    $scope.setActive = function(tab_id){
        _.each($scope.tabs, function(tab){
            if(tab.id==tab_id){
                tab.active = true;
                $scope.active_tab = tab;
            }
            else{
                tab.active = false;
            }
        });
    };

    $scope.addTab = function () {
        var new_tab = {id: $scope.last_id, title:'New_'+$scope.last_id , content:'Just created ' + $scope.last_id};
        $scope.tabs.push(new_tab);
        $scope.last_id++;
        $scope.setActive(new_tab.id);
    };

    $scope.removeTab = function($event){
        $event.stopPropagation();
        var to_remove = this.tab;
        var index_of = $scope.tabs.indexOf(to_remove);
        if(to_remove.active){
            var to_active = null;
            if(index_of!=0){
                to_active = $scope.tabs[index_of-1].id;
                $scope.tabs.splice(index_of, 1);
            }
            else{
                $scope.tabs.splice(index_of, 1);
                if($scope.tabs.length)
                    to_active = $scope.tabs[0].id;
            }
            $scope.setActive(to_active);
        }
        else{
            $scope.tabs.splice(index_of, 1);
        }
    }
    $scope.init();
}