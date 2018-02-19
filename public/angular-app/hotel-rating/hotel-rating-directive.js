angular.module('meanhotel').component('hotelRating', {
    bindings: {
        stars: '='
        //from html in ratingDirective
    },
    template: '<span ng-repeat="star in vm.stars track by $index" class="fa fa-star">{{ star }}</span>',
    controller: 'HotelController',
    controllerAs: 'vm'
    
});

//$index appears to be needed to display stars//